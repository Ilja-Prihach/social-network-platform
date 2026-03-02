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
import { useMe } from '@/features/auth/model/useMe';
import { HOME_FEED_INITIAL_PAGE_SIZE, HOME_FEED_NEXT_PAGE_SIZE } from '@/shared/config/pagination';

type HomePostsPage = {
  items: PostCardVM[];
  nextCursorPostId: number | null;
};

const sortOwnPostsFirst = (items: PostCardVM[], meId: string | null): PostCardVM[] => {
  if (!meId) {
    return items;
  }

  return [...items].sort((left, right) => {
    const leftOwn = left.author.id === meId;
    const rightOwn = right.author.id === meId;
    if (leftOwn === rightOwn) return 0;
    return leftOwn ? -1 : 1;
  });
};

export function useHomePosts(
  initialPosts: PostCardVM[] = [],
  initialNextCursorPostId: number | null = null,
) {
  const { data: me } = useMe();
  const meId = me?.userId ? String(me.userId) : null;

  return useInfiniteQuery<
    HomePostsPage,
    ApiError,
    InfiniteData<HomePostsPage>,
    [string, string | null],
    number | null
  >({
    queryKey: ['home-posts', meId],
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
    ...(initialPosts.length
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
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        items: sortOwnPostsFirst(page.items, meId),
      })),
    }),
    staleTime: 60 * 1000,
    refetchOnMount: true,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: true,
  });
}
