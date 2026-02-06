// /Users/egorgoroh/Desktop/socialNetwork/frontend/app/api/v1/auth/public-user/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch('https://socialnetwork-ai.com/api/v1/public-user', {
    method: 'GET',
  });

  const data = await response.json();
  return NextResponse.json(data);
}
