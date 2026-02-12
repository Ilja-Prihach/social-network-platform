'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getPublicProfilePostsPage, PROFILE_POSTS_PAGE_SIZE } from '../api/profileApi';
import type { ProfilePostsPage } from './types';
import type { ApiError } from '@/shared/api/types';

export const useProfilePostsInfiniteQuery = (profileId: number | null, enabled: boolean = true) => {
  return useInfiniteQuery<ProfilePostsPage, ApiError>({
    queryKey: ['profile-posts', profileId],
    queryFn: ({ pageParam }) =>
      getPublicProfilePostsPage({
        profileId: profileId as number,
        pageNumber: Number(pageParam),
        pageSize: PROFILE_POSTS_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.pageNumber + 1 : undefined),
    enabled: enabled && Number.isFinite(profileId),
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
};
