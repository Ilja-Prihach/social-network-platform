import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ACCESS_TOKEN_COOKIE_NAME } from '@/shared/api/server/accessTokenCookie';

const noStoreHeaders = {
  'Cache-Control': 'no-store',
};

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: noStoreHeaders });
  }

  return NextResponse.json({ accessToken }, { headers: noStoreHeaders });
}
