import { createSocketNotificationAdapter } from './socketAdapter';
import type { NotificationRealtimeCallbacks, NotificationRealtimeMode } from './types';

const NOTIFICATION_REALTIME_MODE_QUERY_PARAM = 'notificationsRealtime';
const DEFAULT_REALTIME_MODE: NotificationRealtimeMode = 'socket-with-fallback';

const resolveNotificationRealtimeMode = (): NotificationRealtimeMode => {
  if (typeof window === 'undefined') {
    return DEFAULT_REALTIME_MODE;
  }

  const mode = new URLSearchParams(window.location.search).get(
    NOTIFICATION_REALTIME_MODE_QUERY_PARAM,
  );

  if (mode === 'socket-only') {
    return mode;
  }

  return DEFAULT_REALTIME_MODE;
};

export const startNotificationRealtime = (callbacks: NotificationRealtimeCallbacks) => {
  const mode = resolveNotificationRealtimeMode();

  return createSocketNotificationAdapter({
    enablePollingFallback: mode !== 'socket-only',
  }).start(callbacks);
};
