import { NextResponse } from 'next/server';

import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';

export async function POST(req: Request) {
  const cookieHeader = req.headers.get('cookie') ?? '';

  const cookieCarrier = new NextResponse();
  const res = await bffFetch(cookieCarrier, '/api/v1/auth/github/update-tokens', {
    method: 'POST',
    headers: {
      Cookie: cookieHeader,
    },
  });

  const nextResponse = await buildJsonResponse(res);
  forwardSetCookie(nextResponse, cookieCarrier);

  return nextResponse;
}
