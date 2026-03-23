import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { bffFetch } from '@/shared/api/server/bffFetch';
import { forwardSetCookie } from '@/shared/api/server/cookies';
import { PUBLIC_POSTS_DEFAULT_PAGE_SIZE } from '@/shared/config/pagination';
import {
  buildPublicPostsQuery,
  PUBLIC_POSTS_DEFAULT_SORT_BY,
  PUBLIC_POSTS_DEFAULT_SORT_DIRECTION,
} from '@/entities/post/api/publicPosts.shared';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const pageSize = Number(searchParams.get('pageSize') ?? PUBLIC_POSTS_DEFAULT_PAGE_SIZE);
  const sortBy = searchParams.get('sortBy') ?? PUBLIC_POSTS_DEFAULT_SORT_BY;
  const sortDirection =
    (searchParams.get('sortDirection') as 'asc' | 'desc' | null) ??
    PUBLIC_POSTS_DEFAULT_SORT_DIRECTION;
  const endCursorPostId = Number(searchParams.get('endCursorPostId') ?? 0);

  const query = buildPublicPostsQuery({
    pageSize: Number.isFinite(pageSize) ? pageSize : PUBLIC_POSTS_DEFAULT_PAGE_SIZE,
    sortBy,
    sortDirection,
  });

  const { res, setCookie } = await bffFetch(
    `/api/v1/posts/all/${Number.isFinite(endCursorPostId) ? endCursorPostId : 0}?${query.toString()}`,
    {
      method: 'GET',
      withAuth: false,
    },
  );

  const nextResponse = await buildJsonResponse(res);

  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}
