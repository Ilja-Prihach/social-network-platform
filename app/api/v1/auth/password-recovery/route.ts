import { NextResponse } from 'next/server';

import { bffFetch } from '@/shared/api/server/bffFetch';
import { forwardSetCookie } from '@/shared/api/server/cookies';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';

export async function POST(req: Request) {
  const body = (await req.json()) as Record<string, unknown>;
  const { locale, ...rest } = body;
  const headers = req.headers;
  const forwardedProto = headers.get('x-forwarded-proto') ?? 'http';
  const forwardedHost = headers.get('x-forwarded-host') ?? headers.get('host');
  const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : new URL(req.url).origin;
  const baseUrl = `${origin}${typeof locale === 'string' && locale ? `/${locale}` : ''}/create-password`;

  const cookieCarrier = new NextResponse();
  const res = await bffFetch(cookieCarrier, '/api/v1/auth/password-recovery', {
    method: 'POST',
    json: {
      ...rest,
      baseUrl,
    },
  });

  const nextResponse = await buildJsonResponse(res);

  forwardSetCookie(nextResponse, cookieCarrier);
  return nextResponse;
}
