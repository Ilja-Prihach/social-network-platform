'use client';

import { useQuery } from '@tanstack/react-query';
import { getPublicProfile } from '../api/profileApi';
import type { PublicProfile } from './types';
import type { ApiError } from '@/shared/api/types';

export const usePublicProfileQuery = (profileId: number | null) => {
  return useQuery<PublicProfile, ApiError>({
    queryKey: ['public-profile', profileId],
    queryFn: () => getPublicProfile(profileId as number),
    enabled: Number.isFinite(profileId),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
};
