import 'server-only';

import type { PublicPostsPageDto } from '@/entities/post';
import {
  buildBackendPublicPostsPath,
  normalizeCursorPageItems,
  resolveNextCursor,
} from '@/entities/post/api/publicPosts.shared';
import { mapPublicPostsToPostCardVM } from '@/widgets/post-card';
import type { PostCardVM } from '@/widgets/post-card';
import { serverApi } from '@/shared/api/server/serverApi';
import { HOME_PREVIEW_PAGE_SIZE } from '@/shared/config/pagination';

type PublicUsersResponse = {
  totalCount: number;
};

type HomePageInitialData = {
  posts: PostCardVM[];
  nextCursorPostId: number | null;
  peopleCount: number | null;
};

export async function getHomePageInitialData(
  pageSize: number = HOME_PREVIEW_PAGE_SIZE,
): Promise<HomePageInitialData> {
  let postsResponse: PublicPostsPageDto | null = null;
  let peopleResponse: PublicUsersResponse | null = null;

  try {
    postsResponse = await serverApi<PublicPostsPageDto>(
      buildBackendPublicPostsPath({
        endCursorPostId: 0,
        pageSize,
      }),
      { withAuth: false },
    );
  } catch {
    postsResponse = null;
  }

  try {
    peopleResponse = await serverApi<PublicUsersResponse>('/api/v1/public-user');
  } catch {
    peopleResponse = null;
  }

  const normalizedItems = normalizeCursorPageItems(postsResponse?.items, 0, pageSize);
  const posts = mapPublicPostsToPostCardVM(normalizedItems);
  const nextCursorPostId = resolveNextCursor(
    normalizedItems,
    postsResponse?.nextCursor,
    pageSize,
    0,
  );
  const peopleCount =
    typeof peopleResponse?.totalCount === 'number' ? peopleResponse.totalCount : null;

  return { posts, nextCursorPostId, peopleCount };
}
