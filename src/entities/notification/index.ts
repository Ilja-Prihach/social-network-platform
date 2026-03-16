export type {
  GetNotificationsParams,
  NotificationItem,
  NotificationPage,
  NotificationRealtimePayload,
} from './model/types';
export {
  buildBackendNotificationsPath,
  NOTIFICATIONS_DEFAULT_PAGE_SIZE,
  NOTIFICATIONS_DEFAULT_SORT,
} from './api/notificationApi.shared';
export { getNotificationsPage, markNotificationsRead } from './api/notificationApi.client';
export {
  notificationsQueryKey,
  useNotificationsInfiniteQuery,
} from './model/useNotificationsInfiniteQuery';
export { useMarkNotificationsReadMutation } from './model/useMarkNotificationsReadMutation';
export { useNotificationRealtimeSync } from './model/useNotificationRealtimeSync';
export { formatNotificationRelativeTime } from './lib/formatNotificationRelativeTime';
