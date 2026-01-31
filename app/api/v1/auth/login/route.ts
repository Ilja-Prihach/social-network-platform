import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL;
const isProd = process.env.NODE_ENV === 'production';
const COOKIE_NAME = isProd ? '__Host-access_token' : 'access_token';

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

  if (!res.ok) {
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = text ? (JSON.parse(text) as { accessToken: string }) : null;
  const accessToken = data?.accessToken;

  if (accessToken) {
    const cookieStore = await cookies();
    cookieStore.set({
      name: COOKIE_NAME,
      value: accessToken,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    });
  }

  return NextResponse.json({ ok: true });
}
