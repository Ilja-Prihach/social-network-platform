import { bffFetch } from '@/shared/api/server/bffFetch';
import { forwardSetCookie } from '@/shared/api/server/cookies';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ deviceId: string }>;
};

export async function DELETE(_: Request, { params }: RouteParams) {
  const { deviceId } = await params;

  if (!/^\d+$/.test(deviceId)) {
    return NextResponse.json({ message: 'Invalid deviceId' }, { status: 400 });
  }

  const { res, setCookie } = await bffFetch(`/api/v1/sessions/${deviceId}`, {
    method: 'DELETE',
  });

  const nextResponse = await buildJsonResponse(res);

  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}
