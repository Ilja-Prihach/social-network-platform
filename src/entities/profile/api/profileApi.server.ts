import 'server-only';

import { serverApi } from '@/shared/api/server/serverApi';
import type { GetPublicProfilePostsParams, ProfilePostsPage, PublicProfile } from '../model/types';
import {
  mapProfilePostsPage,
  PROFILE_POSTS_PAGE_SIZE,
  type RawProfilePostsResponse,
} from './profileApi.shared';

export async function getPublicProfileServer(profileId: number): Promise<PublicProfile> {
  return serverApi<PublicProfile>(`/api/v1/public-user/profile/${profileId}`);
}

export async function getPublicProfilePostsPageServer({
  profileId,
  endCursorPostId,
  pageSize = PROFILE_POSTS_PAGE_SIZE,
}: GetPublicProfilePostsParams): Promise<ProfilePostsPage> {
  const searchParams = new URLSearchParams({
    pageSize: String(pageSize),
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });

  const path =
    typeof endCursorPostId === 'number'
      ? `/api/v1/posts/user/${profileId}/${endCursorPostId}?${searchParams.toString()}`
      : `/api/v1/posts/user/${profileId}?${searchParams.toString()}`;

  const data = await serverApi<RawProfilePostsResponse>(path);

  return mapProfilePostsPage(data, pageSize);
}
