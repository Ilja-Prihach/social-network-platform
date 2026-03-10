import { bffFetch } from '@/shared/api/server/bffFetch';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { forwardSetCookie } from '@/shared/api/server/cookies';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 12;

const normalizeNumber = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const pageNumber = normalizeNumber(searchParams.get('pageNumber'), DEFAULT_PAGE_NUMBER);
  const pageSize = normalizeNumber(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE);

  const query = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
  });

  const { res, setCookie } = await bffFetch(`/api/v1/subscriptions/my-payments?${query}`);

  const nextResponse = await buildJsonResponse(res);
  if (setCookie) forwardSetCookie(nextResponse, setCookie);

  return nextResponse;
}
