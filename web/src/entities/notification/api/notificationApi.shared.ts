import type { GetNotificationsParams, NotificationItem, NotificationPage } from '../model/types';

export const NOTIFICATIONS_DEFAULT_PAGE_SIZE = 12;
export const NOTIFICATIONS_DEFAULT_SORT = {
  sortBy: 'notifyAt',
  sortDirection: 'desc' as const,
};

export type RawNotificationsResponse = {
  pageSize?: number;
  totalCount?: number;
  notReadCount?: number;
  items?: NotificationItem[];
};

type BuildNotificationsQueryParams = Omit<GetNotificationsParams, 'cursor'>;

type MapNotificationsPageParams = {
  pageSize: number;
  currentCursor?: number | null;
};

export const buildNotificationsQuery = ({
  pageSize = NOTIFICATIONS_DEFAULT_PAGE_SIZE,
  sortBy = NOTIFICATIONS_DEFAULT_SORT.sortBy,
  sortDirection = NOTIFICATIONS_DEFAULT_SORT.sortDirection,
  isRead,
}: BuildNotificationsQueryParams = {}): URLSearchParams => {
  const params = new URLSearchParams({
    pageSize: String(pageSize),
    sortBy,
    sortDirection,
  });

  if (typeof isRead === 'boolean') {
    params.set('isRead', String(isRead));
  }

  if (typeof isRead === 'string' && isRead.length > 0) {
    params.set('isRead', isRead);
  }

  return params;
};

export const buildNotificationsPath = ({
  cursor,
  pageSize,
  sortBy,
  sortDirection,
  isRead,
}: GetNotificationsParams = {}) => {
  const query = buildNotificationsQuery({ pageSize, sortBy, sortDirection, isRead });
  const resolvedCursor = resolveCursor(cursor);

  if (resolvedCursor !== null) {
    query.set('cursor', String(resolvedCursor));
  }

  return `/api/notifications?${query.toString()}`;
};

export const buildBackendNotificationsPath = ({
  cursor,
  pageSize,
  sortBy,
  sortDirection,
  isRead,
}: GetNotificationsParams = {}) => {
  const query = buildNotificationsQuery({ pageSize, sortBy, sortDirection, isRead });
  const resolvedCursor = resolveCursor(cursor);
  const basePath = '/api/v1/notifications';

  return resolvedCursor !== null
    ? `${basePath}/${resolvedCursor}?${query.toString()}`
    : `${basePath}?${query.toString()}`;
};

export const mapNotificationsPage = (
  data: RawNotificationsResponse,
  { pageSize, currentCursor }: MapNotificationsPageParams,
): NotificationPage => {
  const items = normalizeNotificationItems(data.items, currentCursor, pageSize);

  return {
    items,
    pageSize: typeof data.pageSize === 'number' ? data.pageSize : pageSize,
    totalCount: typeof data.totalCount === 'number' ? data.totalCount : items.length,
    notReadCount: typeof data.notReadCount === 'number' ? data.notReadCount : 0,
    nextCursor: resolveNextNotificationsCursor(items, pageSize, currentCursor),
  };
};

const normalizeNotificationItems = (
  rawItems: NotificationItem[] | undefined,
  cursor: number | null | undefined,
  pageSize: number,
): NotificationItem[] => {
  const items = Array.isArray(rawItems) ? rawItems : [];

  let normalized = items;
  if (typeof cursor === 'number' && normalized[0]?.id === cursor) {
    normalized = normalized.slice(1);
  }

  if (normalized.length > pageSize) {
    normalized = normalized.slice(0, pageSize);
  }

  return normalized;
};

const resolveNextNotificationsCursor = (
  items: NotificationItem[],
  requestedPageSize: number,
  currentCursor?: number | null,
): number | null => {
  if (items.length < requestedPageSize) {
    return null;
  }

  const lastId = items[items.length - 1]?.id;
  if (typeof lastId !== 'number' || !Number.isFinite(lastId)) {
    return null;
  }

  if (typeof currentCursor === 'number' && currentCursor === lastId) {
    return null;
  }

  return lastId;
};

const resolveCursor = (cursor: GetNotificationsParams['cursor']): number | null => {
  if (typeof cursor === 'number' && Number.isFinite(cursor)) {
    return cursor;
  }

  if (typeof cursor === 'string' && cursor.trim().length > 0) {
    const parsed = Number(cursor);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};
