import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';
import {
  buildBackendProfilePostsPath,
  PROFILE_POSTS_DEFAULT_SORT,
  PROFILE_POSTS_PAGE_SIZE,
} from '@/entities/profile/api/profileApi.shared';

type RouteContext = {
  params: Promise<{ userId: string }>;
};

export async function GET(req: Request, { params }: RouteContext) {
  const { userId } = await params;
  const requestUrl = new URL(req.url);
  const pageSize = requestUrl.searchParams.get('pageSize') ?? String(PROFILE_POSTS_PAGE_SIZE);
  const sortBy = requestUrl.searchParams.get('sortBy') ?? PROFILE_POSTS_DEFAULT_SORT.sortBy;
  const sortDirection =
    requestUrl.searchParams.get('sortDirection') ?? PROFILE_POSTS_DEFAULT_SORT.sortDirection;
  const endCursorPostId = requestUrl.searchParams.get('endCursorPostId');

  const directPath = buildBackendProfilePostsPath({
    profileId: userId,
    pageSize,
    sortBy,
    sortDirection,
    endCursorPostId,
  });

  const result = await bffFetch(directPath, { method: 'GET' });

  const nextResponse = await buildJsonResponse(result.res);
  if (result.setCookie) forwardSetCookie(nextResponse, result.setCookie);
  return nextResponse;
}
