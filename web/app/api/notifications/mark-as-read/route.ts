import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';

export async function PUT(req: Request) {
  const body = await req.json();

  const { res, setCookie } = await bffFetch('/api/v1/notifications/mark-as-read', {
    method: 'PUT',
    json: body,
  });

  const nextResponse = await buildJsonResponse(res);
  if (setCookie) forwardSetCookie(nextResponse, setCookie);
  return nextResponse;
}
