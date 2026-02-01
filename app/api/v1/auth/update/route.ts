import { NextResponse } from 'next/server';

import { bffFetch } from '@/shared/api/server/bffFetch';
import { forwardSetCookie } from '@/shared/api/server/cookies';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';

export async function POST(req: Request) {
  const cookieHeader = req.headers.get('cookie') ?? '';

  const cookieCarrier = new NextResponse();
  const res = await bffFetch(cookieCarrier, '/api/v1/auth/update', {
    method: 'POST',
    headers: {
      Cookie: cookieHeader,
    },
  });

  const nextResponse = await buildJsonResponse(res);

  forwardSetCookie(nextResponse, cookieCarrier);

  return nextResponse;
}
