import { baseApi } from '@/shared/api/baseApi';
import type { GetPublicPostsParams, PublicPostsPageDto } from './publicPosts.shared';
import { buildPublicPostsPath } from './publicPosts.shared';

export async function getPublicPostsPage(
  params: GetPublicPostsParams = {},
): Promise<PublicPostsPageDto> {
  return baseApi<PublicPostsPageDto>(buildPublicPostsPath(params));
}
