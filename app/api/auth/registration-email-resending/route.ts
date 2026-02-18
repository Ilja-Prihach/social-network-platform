import { bffFetch } from '@/shared/api/server/bffFetch';
import { forwardSetCookie } from '@/shared/api/server/cookies';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';

export async function POST(req: Request) {
  const body = (await req.json()) as Record<string, unknown>;

  const { res, setCookie } = await bffFetch('/api/v1/auth/registration-email-resending', {
    method: 'POST',
    json: body,
  });

  const nextResponse = await buildJsonResponse(res);

  if (setCookie) forwardSetCookie(nextResponse, setCookie);
  return nextResponse;
}
