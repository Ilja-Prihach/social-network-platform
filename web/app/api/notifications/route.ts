import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';
import {
  buildBackendNotificationsPath,
  NOTIFICATIONS_DEFAULT_PAGE_SIZE,
  NOTIFICATIONS_DEFAULT_SORT,
} from '@/entities/notification/api/notificationApi.shared';

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const cursor = requestUrl.searchParams.get('cursor');
  const pageSize =
    requestUrl.searchParams.get('pageSize') ?? String(NOTIFICATIONS_DEFAULT_PAGE_SIZE);
  const sortBy = requestUrl.searchParams.get('sortBy') ?? NOTIFICATIONS_DEFAULT_SORT.sortBy;
  const rawSortDirection = requestUrl.searchParams.get('sortDirection');
  const sortDirection =
    rawSortDirection === 'asc' || rawSortDirection === 'desc'
      ? rawSortDirection
      : NOTIFICATIONS_DEFAULT_SORT.sortDirection;
  const isReadParam = requestUrl.searchParams.get('isRead');
  const isRead = isReadParam === null ? undefined : isReadParam;

  const directPath = buildBackendNotificationsPath({
    cursor,
    pageSize,
    sortBy,
    sortDirection,
    isRead,
  });

  const { res, setCookie } = await bffFetch(directPath, { method: 'GET' });
  const nextResponse = await buildJsonResponse(res);
  if (setCookie) forwardSetCookie(nextResponse, setCookie);
  return nextResponse;
}
