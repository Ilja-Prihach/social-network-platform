import { bffFetch } from '@/shared/api/server/bffFetch';
import { forwardSetCookie } from '@/shared/api/server/cookies';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';

export async function DELETE() {
  const { res, setCookie } = await bffFetch('/api/v1/sessions/terminate-all', {
    method: 'DELETE',
  });

  const nextResponse = await buildJsonResponse(res);

  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}
