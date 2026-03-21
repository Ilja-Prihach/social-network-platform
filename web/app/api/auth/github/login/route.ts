import { NextResponse } from 'next/server';

const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const redirectUrl = searchParams.get('redirect_url');

  if (!redirectUrl) {
    return NextResponse.json({ message: 'redirect_url is required' }, { status: 400 });
  }

  if (!apiUrl) {
    return NextResponse.json({ message: 'API_URL is not configured' }, { status: 500 });
  }

  const url = new URL('/api/v1/auth/github/login', apiUrl);
  url.searchParams.set('redirect_url', redirectUrl);

  return NextResponse.redirect(url.toString(), 302);
}
