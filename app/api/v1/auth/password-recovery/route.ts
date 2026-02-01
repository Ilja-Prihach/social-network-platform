import { NextResponse } from 'next/server';

import { bffFetch } from '@/shared/api/server/bffFetch';
import { forwardSetCookie } from '@/shared/api/server/cookies';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';

export async function POST(req: Request) {
  const body = (await req.json()) as Record<string, unknown>;
  const origin = new URL(req.url).origin;

  const cookieCarrier = new NextResponse();
  const res = await bffFetch(cookieCarrier, '/api/v1/auth/password-recovery', {
    method: 'POST',
    json: {
      ...body,
      baseUrl: body.baseUrl ?? origin,
    },
  });

  const nextResponse = await buildJsonResponse(res);

  forwardSetCookie(nextResponse, cookieCarrier);
  return nextResponse;
}
