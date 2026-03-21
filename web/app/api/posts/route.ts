import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';

export async function POST(request: Request) {
  const body = await request.json();

  const { res, setCookie } = await bffFetch('/api/v1/posts', {
    method: 'POST',
    json: body,
  });

  const nextResponse = await buildJsonResponse(res);
  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}
