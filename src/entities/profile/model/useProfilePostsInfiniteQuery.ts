'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getPublicProfilePostsPage, PROFILE_POSTS_PAGE_SIZE } from '@/entities/profile';
import type { ProfilePostsPage } from './types';
import type { ApiError } from '@/shared/api/types';
import type { InfiniteData } from '@tanstack/react-query';

export const useProfilePostsInfiniteQuery = (
  profileId: number | null,
  enabled: boolean = true,
  initialPage?: ProfilePostsPage,
) => {
  return useInfiniteQuery<
    ProfilePostsPage,
    ApiError,
    InfiniteData<ProfilePostsPage>,
    [string, number | null],
    number | null
  >({
    queryKey: ['profile-posts', profileId],
    queryFn: ({ pageParam }) =>
      getPublicProfilePostsPage({
        profileId: profileId as number,
        endCursorPostId: pageParam,
        pageSize: PROFILE_POSTS_PAGE_SIZE,
      }),
    initialPageParam: null as number | null,
    ...(initialPage
      ? {
          initialData: {
            pages: [initialPage],
            pageParams: [null],
          },
        }
      : {}),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((acc, page) => acc + page.items.length, 0);
      if (loaded >= lastPage.totalCount) return undefined;
      if (lastPage.items.length === 0) return undefined;
      return lastPage.nextCursorPostId;
    },
    enabled: enabled && Number.isFinite(profileId),
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
};
