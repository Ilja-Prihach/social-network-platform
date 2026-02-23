'use client';

import {
  getSessions,
  type SessionsResponse,
  terminateAllSessions,
  terminateSessionByDeviceId,
} from '@/entities/auth/api/authApi';
import type { ApiError } from '@/shared/api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const SESSIONS_QUERY_KEY = ['auth-sessions'];

export const useDevicesSessions = () => {
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery<SessionsResponse, ApiError>({
    queryKey: SESSIONS_QUERY_KEY,
    queryFn: getSessions,
    staleTime: 30 * 1000,
  });

  const terminateAllMutation = useMutation<void, ApiError>({
    mutationFn: terminateAllSessions,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
    },
  });

  const terminateOneMutation = useMutation<void, ApiError, number>({
    mutationFn: terminateSessionByDeviceId,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
    },
  });

  return {
    currentSession: sessionsQuery.data?.current,
    otherSessions: sessionsQuery.data?.others ?? [],
    isLoading: sessionsQuery.isLoading,
    isError: sessionsQuery.isError,
    terminateAllOtherSessions: () => terminateAllMutation.mutate(),
    terminateSession: (deviceId: number) => {
      if (deviceId <= 0) return;
      terminateOneMutation.mutate(deviceId);
    },
    isTerminatingAll: terminateAllMutation.isPending,
    isTerminatingOne: terminateOneMutation.isPending,
  };
};
