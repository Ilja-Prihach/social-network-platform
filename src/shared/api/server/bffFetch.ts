import 'server-only';

import { cookies } from 'next/headers';

const API_URL = process.env.API_URL!;
const isProd = process.env.NODE_ENV === 'production';
const COOKIE_NAME = isProd ? '__Host-access_token' : 'access_token';

type BffFetchOptions = RequestInit & {
  json?: unknown;
};

export async function bffFetch(path: string, options: BffFetchOptions = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
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
}
