import { NextResponse } from 'next/server';

import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';

export async function POST(req: Request) {
  const body = await req.json();
  const cookieCarrier = new NextResponse();
  const res = await bffFetch(cookieCarrier, '/api/v1/auth/google/login', {
    method: 'POST',
    json: body,
  });

  const nextResponse = await buildJsonResponse(res);
  forwardSetCookie(nextResponse, cookieCarrier);

  return nextResponse;
}
