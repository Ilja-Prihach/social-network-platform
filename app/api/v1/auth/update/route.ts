import { NextResponse } from 'next/server';

import { forwardSetCookie } from '@/shared/api/server/cookies';

const API_URL = process.env.API_URL ?? '';

export async function POST(req: Request) {
  const cookieHeader = req.headers.get('cookie') ?? '';

  const res = await fetch(`${API_URL}/api/v1/auth/update`, {
    method: 'POST',
    headers: {
      Cookie: cookieHeader,
    },
  });

  const text = await res.text();
  const nextResponse = new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });

  forwardSetCookie(nextResponse, res);

  return nextResponse;
}
