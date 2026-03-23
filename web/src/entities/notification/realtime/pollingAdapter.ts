import type { NotificationRealtimeAdapter } from './types';

type CreateNotificationPollingAdapterParams = {
  intervalMs?: number;
};

export const NOTIFICATION_POLLING_INTERVAL_MS = 30_000;

export const createNotificationPollingAdapter = ({
  intervalMs = NOTIFICATION_POLLING_INTERVAL_MS,
}: CreateNotificationPollingAdapterParams = {}): NotificationRealtimeAdapter => {
  return {
    start: ({ onInvalidate }) => {
      const intervalId = window.setInterval(() => {
        onInvalidate();
      }, intervalMs);

      return () => {
        window.clearInterval(intervalId);
      };
    },
  };
};
