import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';

export async function POST(request: Request) {
  const formData = await request.formData();

  const { res, setCookie } = await bffFetch('/api/v1/posts/image', {
    method: 'POST',
    body: formData,
  });

  const nextResponse = await buildJsonResponse(res);
  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}
