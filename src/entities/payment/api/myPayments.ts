import { baseApi } from '@/shared/api/baseApi';
import type { GetMyPaymentsParams, PaymentsPage } from '../model/types';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 12;

const normalizePositiveNumber = (value: number | undefined, fallback: number) => {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;
};

export const buildMyPaymentsQuery = (params: GetMyPaymentsParams = {}): URLSearchParams => {
  const pageNumber = normalizePositiveNumber(params.pageNumber, DEFAULT_PAGE_NUMBER);
  const pageSize = normalizePositiveNumber(params.pageSize, DEFAULT_PAGE_SIZE);

  return new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
  });
};

export const getMyPayments = (params?: GetMyPaymentsParams) => {
  const query = buildMyPaymentsQuery(params);
  return baseApi<PaymentsPage>(`/api/subscriptions/my-payments?${query.toString()}`);
};
