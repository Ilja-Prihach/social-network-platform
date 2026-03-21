import { NextResponse } from 'next/server';

import { ACCESS_TOKEN_COOKIE_NAME, isProd } from './accessTokenCookie';

export const getSetCookie = (res: Response): string[] => {
  const headers = res.headers as unknown as { getSetCookie?: () => string[] };
  const list = typeof headers.getSetCookie === 'function' ? headers.getSetCookie() : undefined;
  if (Array.isArray(list) && list.length) return list;
  const single = res.headers.get('set-cookie');
  return single ? [single] : [];
};

export const rewriteAccessCookieForProd = (cookie: string): string => {
  if (!isProd) return cookie;

  const parts = cookie.split(';').map((part) => part.trim());
  const [nameValue, ...attrs] = parts;
  if (!nameValue) return cookie;

  const separatorIndex = nameValue.indexOf('=');
  const name = separatorIndex === -1 ? nameValue : nameValue.slice(0, separatorIndex);
  const value = separatorIndex === -1 ? '' : nameValue.slice(separatorIndex + 1);
  if (name !== 'access_token' && name !== ACCESS_TOKEN_COOKIE_NAME) return cookie;

  const normalizedAttrs: string[] = [];
  let hasPath = false;
  let hasSecure = false;

  // __Host- cookies must be Secure, Path=/, and have no Domain.
  attrs.forEach((attr) => {
    const [rawKey, rawVal] = attr.split('=');
    const key = rawKey.toLowerCase();
    const val = rawVal?.trim();

    if (key === 'domain') return;
    if (key === 'path') {
      hasPath = true;
      normalizedAttrs.push('Path=/');
      return;
    }
    if (key === 'secure') {
      hasSecure = true;
      normalizedAttrs.push('Secure');
      return;
    }

    normalizedAttrs.push(val ? `${rawKey}=${val}` : rawKey);
  });

  if (!hasPath) normalizedAttrs.push('Path=/');
  if (!hasSecure) normalizedAttrs.push('Secure');

  return [`${ACCESS_TOKEN_COOKIE_NAME}=${value ?? ''}`, ...normalizedAttrs].join('; ');
};

export const forwardSetCookie = (
  nextResponse: NextResponse,
  source: Response | string[],
): string[] => {
  const cookies = Array.isArray(source) ? source : getSetCookie(source);
  const rewritten = cookies.map(rewriteAccessCookieForProd);

  rewritten.forEach((value) => {
    nextResponse.headers.append('set-cookie', value);
  });

  return rewritten;
};
