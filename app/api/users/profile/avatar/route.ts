import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';

export async function POST(req: Request) {
  const cookieHeader = req.headers.get('cookie') ?? '';
  const formData = await req.formData();

  const { res, setCookie } = await bffFetch('/api/v1/users/profile/avatar', {
    method: 'POST',
    body: formData,
    headers: {
      Cookie: cookieHeader,
    },
  });

  const nextResponse = await buildJsonResponse(res);
  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}

export async function DELETE(req: Request) {
  const cookieHeader = req.headers.get('cookie') ?? '';

  const { res, setCookie } = await bffFetch('/api/v1/users/profile/avatar', {
    method: 'DELETE',
    headers: {
      Cookie: cookieHeader,
    },
  });

  const nextResponse = await buildJsonResponse(res);
  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}
