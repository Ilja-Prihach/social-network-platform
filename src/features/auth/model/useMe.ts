'use client';

import { useQuery } from '@tanstack/react-query';
import { getMe, type MeResponse } from '@/entities/user/api/me';
import type { ApiError } from '@/shared/api/types';

const AUTH_STATUS_REFETCH_INTERVAL_MS = 60_000;

export const useMe = () => {
  return useQuery<MeResponse, ApiError>({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
    staleTime: 0,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: AUTH_STATUS_REFETCH_INTERVAL_MS,
  });
};
