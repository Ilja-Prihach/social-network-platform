import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';

type RouteContext = {
  params: Promise<{ uploadId: string }>;
};

export async function DELETE(_: Request, { params }: RouteContext) {
  const { uploadId } = await params;

  const { res, setCookie } = await bffFetch(`/api/v1/posts/image/${uploadId}`, {
    method: 'DELETE',
  });

  const nextResponse = await buildJsonResponse(res);
  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}
