'use client';

import {
  getSessions,
  terminateAllSessions,
  terminateSessionByDeviceId,
  type SessionItem,
} from '@/entities/auth/api/authApi';
import type { ApiError } from '@/shared/api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type SessionsQueryData = {
  current: SessionItem;
  others: SessionItem[];
};

const SESSIONS_QUERY_KEY = ['auth-sessions'];

const as_string = (value: unknown): string => {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  return '';
};

const as_number = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const from_string = Number(value);
  return Number.isFinite(from_string) ? from_string : -1;
};

const normalize_session = (raw: unknown): SessionItem => {
  const session = (raw ?? {}) as Record<string, unknown>;

  return {
    deviceId: as_number(session.deviceId ?? session.device_id),
    ip: as_string(session.ip) || 'unknown',
    lastActive: as_string(session.lastActive ?? session.last_active),
    browserName: as_string(session.browserName ?? session.browser_name) || 'Unknown browser',
    browserVersion: as_string(session.browserVersion ?? session.browser_version) || 'n/a',
    deviceName: as_string(session.deviceName ?? session.device_name) || 'Unknown device',
    osName: as_string(session.osName ?? session.os_name) || 'Unknown OS',
    osVersion: as_string(session.osVersion ?? session.os_version) || 'n/a',
    deviceType: as_string(session.deviceType ?? session.device_type) || 'unknown',
  };
};

const normalize_sessions = (raw: unknown): SessionsQueryData => {
  const data = (raw ?? {}) as Record<string, unknown>;
  const current = normalize_session(data.current);
  const others_raw = Array.isArray(data.others) ? data.others : [];
  const others = others_raw.map(normalize_session);
  return { current, others };
};

export const useDevicesSessions = () => {
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery<SessionsQueryData, ApiError>({
    queryKey: SESSIONS_QUERY_KEY,
    queryFn: async () => normalize_sessions(await getSessions()),
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
