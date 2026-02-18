import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { bffFetch } from '@/shared/api/server/bffFetch';
import { forwardSetCookie } from '@/shared/api/server/cookies';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const pageSize = searchParams.get('pageSize') ?? '4';
  const sortBy = searchParams.get('sortBy') ?? 'createdAt';
  const sortDirection = searchParams.get('sortDirection') ?? 'desc';
  const endCursorPostId = searchParams.get('endCursorPostId') ?? '0';

  const query = new URLSearchParams({
    pageSize,
    sortBy,
    sortDirection,
  });

  const { res, setCookie } = await bffFetch(
    `/api/v1/posts/all/${endCursorPostId}?${query.toString()}`,
    {
      method: 'GET',
    },
  );

  const nextResponse = await buildJsonResponse(res);

  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}
