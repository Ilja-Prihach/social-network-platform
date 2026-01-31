import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { bffFetch } from '@/shared/api/server/bffFetch';

const isProd = process.env.NODE_ENV === 'production';
const COOKIE_NAME = isProd ? '__Host-access_token' : 'access_token';

export async function POST() {
  try {
    await bffFetch('/api/v1/auth/logout', { method: 'POST' });
  } catch {
    // Ignore upstream errors; client cookie cleanup still required.
  }

  (await cookies()).set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}
