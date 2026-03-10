import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_SORT_BY = 'endDate';
const DEFAULT_SORT_DIRECTION = 'desc';

const ALLOWED_SORT_BY = new Set(['dateOfPayment', 'endDate', 'price', 'paymentType', 'createdAt']);
const ALLOWED_SORT_DIRECTION = new Set(['asc', 'desc']);

const normalizeNumber = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const pageNumber = normalizeNumber(searchParams.get('pageNumber'), DEFAULT_PAGE_NUMBER);
  const pageSize = normalizeNumber(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE);

  const rawSortBy = searchParams.get('sortBy') ?? DEFAULT_SORT_BY;
  const sortBy = ALLOWED_SORT_BY.has(rawSortBy) ? rawSortBy : DEFAULT_SORT_BY;

  const rawSortDirection = searchParams.get('sortDirection') ?? DEFAULT_SORT_DIRECTION;
  const sortDirection = ALLOWED_SORT_DIRECTION.has(rawSortDirection)
    ? rawSortDirection
    : DEFAULT_SORT_DIRECTION;

  const query = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
    sortBy,
    sortDirection,
  });

  const { res, setCookie } = await bffFetch(`/api/v1/subscriptions/my-payments?${query}`);

  const nextResponse = await buildJsonResponse(res);
  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}
