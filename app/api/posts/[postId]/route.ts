import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';

type RouteContext = {
  params: Promise<{ postId: string }>;
};

export async function DELETE(_: Request, { params }: RouteContext) {
  const { postId } = await params;

  const { res, setCookie } = await bffFetch(`/api/v1/posts/${encodeURIComponent(postId)}`, {
    method: 'DELETE',
  });

  const nextResponse = await buildJsonResponse(res);
  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { postId } = await params;
  const body = await request.json();

  const { res, setCookie } = await bffFetch(`/api/v1/posts/${encodeURIComponent(postId)}`, {
    method: 'PUT',
    json: body,
  });

  const nextResponse = await buildJsonResponse(res);
  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}
