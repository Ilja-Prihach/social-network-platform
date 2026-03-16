import { baseApi } from '@/shared/api/baseApi';
import type { GetNotificationsParams, NotificationPage } from '../model/types';
import {
  buildNotificationsPath,
  mapNotificationsPage,
  NOTIFICATIONS_DEFAULT_PAGE_SIZE,
  type RawNotificationsResponse,
} from './notificationApi.shared';

export { NOTIFICATIONS_DEFAULT_PAGE_SIZE };

export async function getNotificationsPage({
  cursor,
  pageSize = NOTIFICATIONS_DEFAULT_PAGE_SIZE,
  sortBy,
  sortDirection,
  isRead,
}: GetNotificationsParams = {}): Promise<NotificationPage> {
  const data = await baseApi<RawNotificationsResponse>(
    buildNotificationsPath({ cursor, pageSize, sortBy, sortDirection, isRead }),
  );

  const currentCursor =
    typeof cursor === 'number' ? cursor : typeof cursor === 'string' ? Number(cursor) : null;

  return mapNotificationsPage(data, {
    pageSize: typeof pageSize === 'number' ? pageSize : Number(pageSize),
    currentCursor: Number.isFinite(currentCursor) ? currentCursor : null,
  });
}

export function markNotificationsRead(ids: number[]) {
  return baseApi<void>('/api/notifications/mark-as-read', {
    method: 'PUT',
    body: { ids },
  });
}

export async function getSocketAccessToken(): Promise<string | null> {
  const response = await fetch('/api/auth/socket-token', {
    method: 'GET',
    cache: 'no-store',
  });

  if (response.status === 401) {
    return null;
  }

  const text = await response.text();
  const data = text ? (JSON.parse(text) as { accessToken?: string }) : {};

  if (!response.ok) {
    throw {
      status: response.status,
      data,
    };
  }

  return typeof data.accessToken === 'string' ? data.accessToken : null;
}
