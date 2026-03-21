'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyPayments } from '@/entities/payment';
import type { PaymentsPage, GetMyPaymentsParams } from '@/entities/payment';
import type { ApiError } from '@/shared/api/types';

type UseMyPaymentsQueryParams = GetMyPaymentsParams & {
  enabled?: boolean;
};

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 12;

export const useMyPaymentsQuery = (params: UseMyPaymentsQueryParams = {}) => {
  const pageNumber = params.pageNumber ?? DEFAULT_PAGE_NUMBER;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

  return useQuery<PaymentsPage, ApiError>({
    queryKey: ['my-payments', pageNumber, pageSize],
    queryFn: () => getMyPayments({ pageNumber, pageSize }),
    enabled: params.enabled ?? true,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: false,
  });
};
