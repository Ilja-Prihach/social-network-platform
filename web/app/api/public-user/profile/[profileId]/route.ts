import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';

type RouteContext = {
  params: Promise<{ profileId: string }>;
};

export async function GET(_req: Request, { params }: RouteContext) {
  const { profileId } = await params;

  const { res, setCookie } = await bffFetch(`/api/v1/public-user/profile/${profileId}`, {
    method: 'GET',
  });

  const nextResponse = await buildJsonResponse(res);
  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}
