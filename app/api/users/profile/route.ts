import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';

export async function PUT(req: Request) {
  const cookieHeader = req.headers.get('cookie') ?? '';
  const payload = await req.json();

  const { res, setCookie } = await bffFetch('/api/v1/users/profile', {
    method: 'PUT',
    json: payload,
    headers: {
      Cookie: cookieHeader,
    },
  });

  const nextResponse = await buildJsonResponse(res);
  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}
