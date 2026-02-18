import { baseApi } from '@/shared/api/baseApi';
import type { GetPublicProfilePostsParams, ProfilePostsPage, PublicProfile } from '../model/types';
import {
  buildProfilePostsPath,
  mapProfilePostsPage,
  PROFILE_POSTS_PAGE_SIZE,
  type RawProfilePostsResponse,
} from './profileApi.shared';

export { PROFILE_POSTS_PAGE_SIZE };

export function getPublicProfile(profileId: number) {
  return baseApi<PublicProfile>(`/api/public-user/profile/${profileId}`);
}

export async function getPublicProfilePostsPage({
  profileId,
  endCursorPostId,
  pageSize = PROFILE_POSTS_PAGE_SIZE,
}: GetPublicProfilePostsParams): Promise<ProfilePostsPage> {
  const data = await baseApi<RawProfilePostsResponse>(
    buildProfilePostsPath({ profileId, endCursorPostId, pageSize }),
  );

  return mapProfilePostsPage(data, pageSize);
}
