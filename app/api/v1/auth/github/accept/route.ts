import { NextResponse } from 'next/server';

const isProd = process.env.NODE_ENV === 'production';
const accessCookieName = isProd ? '__Host-access_token' : 'access_token';

export async function POST(req: Request) {
  const body = (await req.json()) as { accessToken?: string } | null;
  const accessToken = body?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ message: 'accessToken is required' }, { status: 400 });
  }

  const nextResponse = NextResponse.json({ ok: true });
  nextResponse.cookies.set({
    name: accessCookieName,
    value: accessToken,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
  });

  return nextResponse;
}
