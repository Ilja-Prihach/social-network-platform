import { NextResponse } from 'next/server';

import { forwardSetCookie } from '@/shared/api/server/cookies';

const API_URL = process.env.API_URL;

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  const nextResponse = res.ok
    ? NextResponse.json({ ok: true })
    : new NextResponse(text, {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
  forwardSetCookie(nextResponse, res);
  return nextResponse;
}
