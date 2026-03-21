'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import { getPublicPostsPage } from '@/entities/post';
import {
  normalizeCursorPageItems,
  resolveNextCursor,
} from '@/entities/post/api/publicPosts.shared';
import type { ApiError } from '@/shared/api/types';
import { mapPublicPostsToPostCardVM } from '@/widgets/post-card';
import type { PostCardVM } from '@/widgets/post-card';
import { HOME_FEED_INITIAL_PAGE_SIZE, HOME_FEED_NEXT_PAGE_SIZE } from '@/shared/config/pagination';

type HomePostsPage = {
  items: PostCardVM[];
  nextCursorPostId: number | null;
};

export function useHomePosts(
  initialPosts: PostCardVM[] = [],
  initialNextCursorPostId: number | null = null,
  options?: { enabled?: boolean; mode?: 'preview' | 'feed' },
) {
  const mode = options?.mode ?? 'feed';

  return useInfiniteQuery<
    HomePostsPage,
    ApiError,
    InfiniteData<HomePostsPage>,
    [string, 'preview' | 'feed'],
    number | null
  >({
    queryKey: ['home-posts', mode],
    queryFn: async ({ pageParam }) => {
      const isInitialPage = pageParam === 0;
      const targetPageSize = isInitialPage ? HOME_FEED_INITIAL_PAGE_SIZE : HOME_FEED_NEXT_PAGE_SIZE;
      const requestPageSize = isInitialPage ? targetPageSize : targetPageSize + 1;
      const response = await getPublicPostsPage({
        pageSize: requestPageSize,
        endCursorPostId: pageParam ?? 0,
      });
      const normalizedItems = normalizeCursorPageItems(response.items, pageParam, targetPageSize);
      const items = mapPublicPostsToPostCardVM(normalizedItems);

      return {
        items,
        nextCursorPostId: resolveNextCursor(
          normalizedItems,
          response.nextCursor,
          targetPageSize,
          pageParam,
        ),
      };
    },
    initialPageParam: 0 as number | null,
    ...(initialPosts.length && (options?.enabled ?? true)
      ? {
          initialData: {
            pages: [
              {
                items: initialPosts,
                nextCursorPostId: initialNextCursorPostId,
              },
            ],
            pageParams: [0],
          },
        }
      : {}),
    getNextPageParam: (lastPage) => {
      if (lastPage.items.length === 0) return undefined;

      return typeof lastPage.nextCursorPostId === 'number' ? lastPage.nextCursorPostId : undefined;
    },
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
    refetchOnMount: options?.enabled ?? true,
    refetchInterval: options?.enabled ? 60 * 1000 : false,
    refetchIntervalInBackground: options?.enabled ?? true,
  });
}
