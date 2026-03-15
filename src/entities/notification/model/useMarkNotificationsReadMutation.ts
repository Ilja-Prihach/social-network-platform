'use client';

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';

import { markNotificationsRead } from '../api/notificationApi.client';
import { notificationsQueryKey } from './useNotificationsInfiniteQuery';
import type { NotificationPage } from './types';
import type { ApiError } from '@/shared/api/types';

export const useMarkNotificationsReadMutation = (userId: number | null) => {
  const queryClient = useQueryClient();
  const queryKey = notificationsQueryKey(userId);

  return useMutation<void, ApiError, number[], { previousData?: InfiniteData<NotificationPage> }>({
    mutationFn: (ids) => markNotificationsRead(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<InfiniteData<NotificationPage>>(queryKey);
      if (previousData) {
        queryClient.setQueryData<InfiniteData<NotificationPage>>(
          queryKey,
          markIdsAsRead(previousData, ids),
        );
      }

      return { previousData };
    },
    onError: (_error, _ids, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });
};

const markIdsAsRead = (
  data: InfiniteData<NotificationPage>,
  ids: number[],
): InfiniteData<NotificationPage> => {
  const idSet = new Set(ids);
  let updatedCount = 0;

  const pages = data.pages.map((page) => {
    const items = page.items.map((item) => {
      if (item.isRead || !idSet.has(item.id)) {
        return item;
      }

      updatedCount += 1;
      return { ...item, isRead: true };
    });

    return {
      ...page,
      items,
    };
  });

  if (updatedCount === 0) {
    return data;
  }

  const baseNotReadCount = data.pages[0]?.notReadCount ?? 0;
  const nextNotReadCount = Math.max(0, baseNotReadCount - updatedCount);

  return {
    ...data,
    pages: pages.map((page) => ({
      ...page,
      notReadCount: nextNotReadCount,
    })),
  };
};
