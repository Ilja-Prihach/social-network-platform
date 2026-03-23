import { bffFetch } from '@/shared/api/server/bffFetch';
import { forwardSetCookie } from '@/shared/api/server/cookies';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';

export async function POST(req: Request) {
  const cookieHeader = req.headers.get('cookie') ?? '';

  const { res, setCookie } = await bffFetch('/api/v1/auth/update', {
    method: 'POST',
    headers: {
      Cookie: cookieHeader,
    },
  });

  const nextResponse = await buildJsonResponse(res);

  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}
