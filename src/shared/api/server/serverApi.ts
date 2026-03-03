import 'server-only';

import { bffFetch } from './bffFetch';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type ServerRequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  withAuth?: boolean;
};

export async function serverApi<T>(path: string, options: ServerRequestOptions = {}): Promise<T> {
  const { res } = await bffFetch(path, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    json: options.body,
    withAuth: options.withAuth,
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    throw {
      status: res.status,
      data,
    };
  }

  return data as T;
}
