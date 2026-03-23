import { NextResponse } from 'next/server';

import { bffFetch } from '@/shared/api/server/bffFetch';
import { forwardSetCookie } from '@/shared/api/server/cookies';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';

export async function POST(req: Request) {
  const body = await req.json();

  const { res, setCookie } = await bffFetch('/api/v1/auth/login', {
    method: 'POST',
    json: body,
  });

  const nextResponse = res.ok ? NextResponse.json({ ok: true }) : await buildJsonResponse(res);
  if (setCookie) forwardSetCookie(nextResponse, setCookie);
  return nextResponse;
}
