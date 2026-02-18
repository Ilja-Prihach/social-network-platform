import type { SessionItem } from '@/entities/auth/api/authApi';

export type SessionsQueryData = {
  current: SessionItem;
  others: SessionItem[];
};

const toDeviceId = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return -1;
};

const normalizeSession = (raw: unknown): SessionItem => {
  const session = (raw ?? {}) as Record<string, unknown>;

  return {
    deviceId: toDeviceId(session.deviceId ?? session.device_id),
    ip: (session.ip ?? '') as string,
    lastActive: (session.lastActive ?? session.last_active ?? '') as string,
    browserName: (session.browserName ?? session.browser_name ?? '') as string,
    browserVersion: (session.browserVersion ?? session.browser_version ?? '') as string,
    deviceName: (session.deviceName ?? session.device_name ?? '') as string,
    osName: (session.osName ?? session.os_name ?? '') as string,
    osVersion: (session.osVersion ?? session.os_version ?? '') as string,
    deviceType: (session.deviceType ?? session.device_type ?? '') as string,
  };
};

export const normalizeSessions = (raw: unknown): SessionsQueryData => {
  const data = (raw ?? {}) as Record<string, unknown>;
  const current = normalizeSession(data.current);
  const othersRaw = Array.isArray(data.others) ? data.others : [];

  return {
    current,
    others: othersRaw.map(normalizeSession),
  };
};
