import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';

type RouteContext = {
  params: Promise<{ userId: string }>;
};

export async function GET(req: Request, { params }: RouteContext) {
  const { userId } = await params;
  const requestUrl = new URL(req.url);
  const pageSize = requestUrl.searchParams.get('pageSize') ?? '8';
  const sortBy = requestUrl.searchParams.get('sortBy') ?? 'createdAt';
  const sortDirection = requestUrl.searchParams.get('sortDirection') ?? 'desc';
  const endCursorPostId = requestUrl.searchParams.get('endCursorPostId');

  const query = `pageSize=${encodeURIComponent(pageSize)}&sortBy=${encodeURIComponent(sortBy)}&sortDirection=${encodeURIComponent(sortDirection)}`;
  const basePath = `/api/v1/posts/user/${userId}`;
  const directPath = endCursorPostId
    ? `${basePath}/${endCursorPostId}?${query}`
    : `${basePath}?${query}`;

  let result = await bffFetch(directPath, { method: 'GET' });

  // Some environments require a path cursor for the first page; retry with cursor=0.
  if (!endCursorPostId && !result.res.ok && result.res.status === 404) {
    result = await bffFetch(`${basePath}/0?${query}`, { method: 'GET' });
  }

  const nextResponse = await buildJsonResponse(result.res);
  if (result.setCookie) forwardSetCookie(nextResponse, result.setCookie);
  return nextResponse;
}
