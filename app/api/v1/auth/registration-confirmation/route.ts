import { NextResponse } from 'next/server';

import { bffFetch } from '@/shared/api/server/bffFetch';
import { forwardSetCookie } from '@/shared/api/server/cookies';

export async function POST(req: Request) {
  const body = await req.json();

  const { res, setCookie } = await bffFetch('/api/v1/auth/registration-confirmation', {
    method: 'POST',
    json: body,
  });

  const text = await res.text();
  const nextResponse = new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });

  if (setCookie?.length) forwardSetCookie(nextResponse, setCookie);
  return nextResponse;
}
