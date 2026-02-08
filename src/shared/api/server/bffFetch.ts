import 'server-only';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { forwardSetCookie, getSetCookie } from './cookies';

const API_URL = 'https://inctagram.work';
const isProd = process.env.NODE_ENV === 'production';
const COOKIE_NAME = isProd ? '__Host-access_token' : 'access_token';
const REFRESH_PATH = '/api/v1/auth/update';

type BffFetchOptions = RequestInit & {
  json?: unknown;
};

export type BffFetchResult = {
  res: Response;
  setCookie?: string[];
};

type RefreshResult = { setCookie: string[]; accessToken?: string } | null;

let refreshPromise: Promise<RefreshResult> | null = null;

const buildAccessCookie = (token: string): string => {
  const attrs = ['Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (isProd) attrs.push('Secure');
  return `${COOKIE_NAME}=${token}; ${attrs.join('; ')}`;
};

const hasCookie = (cookies: string[] | undefined, name: string): boolean => {
  if (!cookies || !cookies.length) return false;
  return cookies.some((cookie) => cookie.startsWith(`${name}=`));
};

export async function bffFetch(
  nextRes: NextResponse,
  path: string,
  options?: BffFetchOptions,
): Promise<Response>;
export async function bffFetch(path: string, options?: BffFetchOptions): Promise<BffFetchResult>;
export async function bffFetch(
  arg1: NextResponse | string,
  arg2?: string | BffFetchOptions,
  arg3?: BffFetchOptions,
): Promise<Response | BffFetchResult> {
  const nextRes = typeof arg1 === 'string' ? undefined : (arg1 as NextResponse);
  const path = typeof arg1 === 'string' ? arg1 : (arg2 as string);
  const options =
    typeof arg1 === 'string'
      ? ((arg2 ?? {}) as BffFetchOptions)
      : ((arg3 ?? {}) as BffFetchOptions);

  const doFetch = async (tokenOverride?: string) => {
    const cookieStore = await cookies();
    const token = tokenOverride ?? cookieStore.get(COOKIE_NAME)?.value;
    const headers = new Headers(options.headers);

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (options.json !== undefined && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
    });
  };

  const res = await doFetch();
  const setCookie = forwardIfNeeded(nextRes, res);
  const normalizedSetCookie = setCookie && setCookie.length ? setCookie : undefined;
  const shouldAttemptJson = shouldAttemptJsonParse(res, path);
  const { accessToken, sanitized } = await extractAccessToken(res, shouldAttemptJson);
  if (accessToken) setAccessCookie(nextRes, accessToken);
  const baseSetCookie =
    !nextRes && accessToken && !hasCookie(normalizedSetCookie, COOKIE_NAME)
      ? [...(normalizedSetCookie ?? []), buildAccessCookie(accessToken)]
      : normalizedSetCookie;

  const initialRes = sanitized ?? res;
  if (res.status !== 401 || path === REFRESH_PATH) {
    return nextRes ? initialRes : { res: initialRes, setCookie: baseSetCookie };
  }

  const refreshed = await refreshTokens();
  if (refreshed?.setCookie?.length) forwardIfNeeded(nextRes, refreshed.setCookie);
  if (refreshed?.accessToken) setAccessCookie(nextRes, refreshed.accessToken);

  if (!refreshed?.accessToken) {
    const merged =
      baseSetCookie && refreshed?.setCookie?.length
        ? [...baseSetCookie, ...refreshed.setCookie]
        : baseSetCookie;
    return nextRes ? initialRes : { res: initialRes, setCookie: merged };
  }

  const retryRes = await doFetch(refreshed.accessToken);
  const retrySetCookie = forwardIfNeeded(nextRes, retryRes);
  const { accessToken: retryAccessToken, sanitized: retrySanitized } = await extractAccessToken(
    retryRes,
    shouldAttemptJsonParse(retryRes, path),
  );
  if (retryAccessToken) setAccessCookie(nextRes, retryAccessToken);

  if (!nextRes) {
    const merged = [
      ...(baseSetCookie ?? []),
      ...(refreshed.setCookie ?? []),
      ...(retrySetCookie ?? []),
    ];
    return { res: retrySanitized ?? retryRes, setCookie: merged.length ? merged : undefined };
  }

  return retrySanitized ?? retryRes;
}

const refreshTokens = async (): Promise<RefreshResult> => {
  if (refreshPromise) return refreshPromise;

  // Single-flight: concurrent 401s await the same refresh request.
  refreshPromise = (async () => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .filter(({ name }) => name === 'refreshToken' || name === COOKIE_NAME)
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');

    const res = await fetch(`${API_URL}${REFRESH_PATH}`, {
      method: 'POST',
      headers: {
        Cookie: cookieHeader,
      },
    });

    const setCookie = forwardIfNeeded(undefined, res) ?? [];
    if (!res.ok) return { setCookie };

    const { accessToken } = await extractAccessToken(res, true);
    return { setCookie, accessToken };
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

const extractAccessToken = async (
  res: Response,
  attemptJson: boolean,
): Promise<{ accessToken?: string; sanitized?: Response }> => {
  if (!attemptJson) return {};

  try {
    const data = (await res.clone().json()) as unknown;
    if (!isRecord(data) || typeof data.accessToken !== 'string') return {};

    const sanitized = { ...data } as Record<string, unknown>;
    delete sanitized.accessToken;

    const headers = new Headers(res.headers);
    headers.delete('content-length');

    return {
      accessToken: data.accessToken,
      sanitized: new Response(JSON.stringify(sanitized), {
        status: res.status,
        statusText: res.statusText,
        headers,
      }),
    };
  } catch {
    return {};
  }
};

const isJsonResponse = (res: Response): boolean => {
  const contentType = res.headers.get('content-type');
  return Boolean(contentType && contentType.toLowerCase().includes('application/json'));
};

const shouldAttemptJsonParse = (res: Response, path: string): boolean => {
  if (isJsonResponse(res)) return true;
  return path.startsWith('/api/v1/auth/');
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const setAccessCookie = (nextRes: NextResponse | undefined, token: string) => {
  if (!nextRes) return;
  nextRes.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
  });
};

const forwardIfNeeded = (nextRes: NextResponse | undefined, source: Response | string[]) => {
  if (!nextRes) {
    return Array.isArray(source) ? source : getSetCookie(source);
  }

  return forwardSetCookie(nextRes, source);
};
