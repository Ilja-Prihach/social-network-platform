import { NextResponse } from 'next/server';

import { bffFetch } from '@/shared/api/server/bffFetch';

export async function POST(req: Request) {
  const body = await req.json();

  const res = await bffFetch('/api/v1/auth/registration-confirmation', {
    method: 'POST',
    json: body,
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
