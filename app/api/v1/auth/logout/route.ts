import { NextResponse } from 'next/server';

import { bffFetch } from '@/shared/api/server/bffFetch';
import { forwardSetCookie } from '@/shared/api/server/cookies';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';

export async function POST() {
  const cookieCarrier = new NextResponse();
  const res = await bffFetch(cookieCarrier, '/api/v1/auth/logout', { method: 'POST' });
  const nextResponse = await buildJsonResponse(res);

  forwardSetCookie(nextResponse, cookieCarrier);

  return nextResponse;
}
