import { NextResponse } from 'next/server';

import { bffFetch } from '@/shared/api/server/bffFetch';

export async function POST(req: Request) {
  const body = (await req.json()) as Record<string, unknown>;
  const origin = new URL(req.url).origin;

  const res = await bffFetch('/api/v1/auth/password-recovery', {
    method: 'POST',
    json: {
      ...body,
      baseUrl: body.baseUrl ?? origin,
    },
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
