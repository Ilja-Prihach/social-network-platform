import { NextResponse } from 'next/server';

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

const DEFAULT_ERROR_MESSAGE = 'Request failed';

export const buildJsonResponse = async (
  res: Response,
  fallbackMessage: string = DEFAULT_ERROR_MESSAGE,
): Promise<NextResponse> => {
  const cloned = res.clone();
  const headers = new Headers(res.headers);
  headers.delete('content-length');
  headers.set('content-type', 'application/json');

  const data = await readJsonOrText(cloned, fallbackMessage, res.ok);
  return new NextResponse(JSON.stringify(data), {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
};

const readJsonOrText = async (
  res: Response,
  fallbackMessage: string,
  isOk: boolean,
): Promise<JsonValue> => {
  try {
    const json = (await res.json()) as unknown;
    if (isJsonValue(json)) return json;
  } catch {
    // ignore and fall back to text
  }

  try {
    const text = await res.text();
    if (text) return { message: text };
  } catch {
    // ignore
  }

  return isOk ? { ok: true } : { message: fallbackMessage };
};

const isJsonValue = (value: unknown): value is JsonValue => {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).every(isJsonValue);
  }
  return false;
};
