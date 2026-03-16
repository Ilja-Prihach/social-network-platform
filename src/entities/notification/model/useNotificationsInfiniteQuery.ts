'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';

import {
  getNotificationsPage,
  NOTIFICATIONS_DEFAULT_PAGE_SIZE,
} from '../api/notificationApi.client';
import type { NotificationPage } from './types';
import type { ApiError } from '@/shared/api/types';

export const notificationsQueryKey = (userId: number | null) => ['notifications', userId] as const;

export const useNotificationsInfiniteQuery = (userId: number | null, enabled: boolean = true) => {
  return useInfiniteQuery<
    NotificationPage,
    ApiError,
    InfiniteData<NotificationPage>,
    ReturnType<typeof notificationsQueryKey>,
    number | null
  >({
    queryKey: notificationsQueryKey(userId),
    queryFn: ({ pageParam }) =>
      getNotificationsPage({
        cursor: pageParam,
        pageSize: NOTIFICATIONS_DEFAULT_PAGE_SIZE,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((acc, page) => acc + page.items.length, 0);
      if (loaded >= lastPage.totalCount) return undefined;
      if (lastPage.items.length === 0) return undefined;
      return lastPage.nextCursor ?? undefined;
    },
    enabled: enabled && Number.isFinite(userId),
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: true,
  });
};
