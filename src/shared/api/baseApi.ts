// export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? '/api').replace(/\/$/, '');

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
}

export async function baseApi<T>(url: string, options: RequestOptions): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
