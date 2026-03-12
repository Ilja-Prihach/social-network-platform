import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { bffFetch } from '@/shared/api/server/bffFetch';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/shared/api/server/accessTokenCookie';
import { forwardSetCookie } from '@/shared/api/server/cookies';

const noStoreHeaders = {
  'Cache-Control': 'no-store',
};

const extractAccessTokenFromSetCookie = (setCookie: string[] | undefined): string | null => {
  if (!setCookie?.length) {
    return null;
  }

  const accessCookie = setCookie.find((cookie) =>
    cookie.startsWith(`${ACCESS_TOKEN_COOKIE_NAME}=`),
  );
  if (!accessCookie) {
    return null;
  }

  const [nameValue] = accessCookie.split(';');
  if (!nameValue) {
    return null;
  }

  const separatorIndex = nameValue.indexOf('=');
  if (separatorIndex === -1) {
    return null;
  }

  return nameValue.slice(separatorIndex + 1) || null;
};

export async function GET() {
  const cookieStore = await cookies();
  const currentAccessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value ?? null;
  const { res, setCookie } = await bffFetch('/api/v1/auth/me', {
    method: 'GET',
  });

  const accessToken = extractAccessTokenFromSetCookie(setCookie) ?? currentAccessToken;
  const nextResponse = NextResponse.json(
    accessToken ? { accessToken } : { error: 'Unauthorized' },
    {
      status: accessToken && res.ok ? 200 : res.status,
      headers: noStoreHeaders,
    },
  );

  if (setCookie) {
    forwardSetCookie(nextResponse, setCookie);
  }

  return nextResponse;
}
