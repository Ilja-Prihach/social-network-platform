'use client';

import { useQuery } from '@tanstack/react-query';
import { getMe, type MeResponse } from '@/entities/user/api/me';
import type { ApiError } from '@/shared/api/types';

export const useMe = () => {
  return useQuery<MeResponse, ApiError>({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
