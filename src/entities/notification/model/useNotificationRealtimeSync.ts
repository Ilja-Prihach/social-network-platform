'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { notificationsQueryKey } from './useNotificationsInfiniteQuery';
import { startNotificationRealtime } from '../realtime/createNotificationRealtime';

type UseNotificationRealtimeSyncParams = {
  enabled: boolean;
  userId: number | null;
};

export const useNotificationRealtimeSync = ({
  enabled,
  userId,
}: UseNotificationRealtimeSyncParams) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !Number.isFinite(userId)) {
      return;
    }

    return startNotificationRealtime({
      onInvalidate: () => {
        void queryClient.invalidateQueries({
          queryKey: notificationsQueryKey(userId),
        });
      },
    });
  }, [enabled, queryClient, userId]);
};
