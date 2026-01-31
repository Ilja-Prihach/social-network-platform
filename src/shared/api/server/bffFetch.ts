import 'server-only';

import { cookies } from 'next/headers';

import { getSetCookie } from './cookies';

const API_URL = process.env.API_URL ?? '';
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

let refreshPromise: Promise<{ setCookie: string[]; accessToken?: string } | null> | null = null;

export async function bffFetch(
  path: string,
  options: BffFetchOptions = {},
): Promise<BffFetchResult> {
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
  const resSetCookie = getSetCookie(res);
  if (res.status !== 401 || path === REFRESH_PATH) {
    return { res, setCookie: resSetCookie.length ? resSetCookie : undefined };
  }

  const refreshed = await refreshTokens();
  if (!refreshed || !refreshed.accessToken) {
    const merged = refreshed?.setCookie ? [...resSetCookie, ...refreshed.setCookie] : resSetCookie;
    return { res, setCookie: merged.length ? merged : undefined };
  }

  const retryRes = await doFetch(refreshed.accessToken);
  const retrySetCookie = getSetCookie(retryRes);
  const merged = [...refreshed.setCookie, ...retrySetCookie];

  return { res: retryRes, setCookie: merged.length ? merged : undefined };
}

const refreshTokens = async (): Promise<{ setCookie: string[]; accessToken?: string } | null> => {
  if (refreshPromise) return refreshPromise;

  // Single-flight: concurrent 401s await the same refresh request.
  refreshPromise = (async () => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');

    const res = await fetch(`${API_URL}${REFRESH_PATH}`, {
      method: 'POST',
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!res.ok) return null;

    const setCookie = getSetCookie(res);
    if (!setCookie.length) return null;

    const accessToken = extractAccessToken(setCookie);
    return { setCookie, accessToken };
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

const extractAccessToken = (setCookie: string[]): string | undefined => {
  const match = setCookie
    .map((cookie) => cookie.split(';')[0]?.trim() ?? '')
    .map((pair) => {
      const index = pair.indexOf('=');
      if (index === -1) return [pair, ''] as const;
      return [pair.slice(0, index), pair.slice(index + 1)] as const;
    })
    .find(([name]) => name === COOKIE_NAME || name === 'access_token');

  return match?.[1];
};
