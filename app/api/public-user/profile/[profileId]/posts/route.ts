import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';

type RouteContext = {
  params: Promise<{ profileId: string }>;
};

export async function GET(req: Request, { params }: RouteContext) {
  const { profileId } = await params;
  const url = new URL(req.url);
  const query = url.searchParams.toString();
  const path = `/api/v1/public-user/profile/${profileId}/posts${query ? `?${query}` : ''}`;

  const { res, setCookie } = await bffFetch(path, { method: 'GET' });
  const nextResponse = await buildJsonResponse(res);

  if (setCookie) forwardSetCookie(nextResponse, setCookie);
  return nextResponse;
}
