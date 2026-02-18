import type { SessionItem } from '@/entities/auth/api/authApi';

export type DevicesTexts = {
  na: string;
  unknown: string;
  unknownBrowser: string;
  unknownOs: string;
  unknownDevice: string;
  on: string;
};

export type SessionsView = {
  current: SessionItem | null;
  others: SessionItem[];
};

export const formatLastActive = (iso: string, texts: DevicesTexts): string => {
  if (!iso) return texts.na;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
};

export const toSessionTitle = (session: SessionItem, texts: DevicesTexts): string => {
  const browser =
    `${session.browserName || texts.unknownBrowser} ${session.browserVersion || texts.na}`.trim();
  const os = `${session.osName || texts.unknownOs} ${session.osVersion || texts.na}`.trim();
  const device = session.deviceName || texts.unknownDevice;

  return `${browser} ${texts.on} ${device} (${os})`;
};

const isUnknownLike = (value: string): boolean => {
  const normalized = (value || '').toLowerCase();
  return !normalized || normalized === 'n/a' || normalized.includes('unknown');
};

const isLowQualitySession = (session: SessionItem): boolean => {
  return (
    isUnknownLike(session.browserName) &&
    isUnknownLike(session.deviceName) &&
    isUnknownLike(session.osName)
  );
};

const isSameSession = (a: SessionItem, b: SessionItem): boolean => {
  if (a.deviceId > 0 && b.deviceId > 0) return a.deviceId === b.deviceId;
  return a.ip === b.ip && a.lastActive === b.lastActive;
};

const dedupeSessions = (sessions: SessionItem[]): SessionItem[] => {
  const seen = new Set<string>();
  return sessions.filter((session) => {
    const key =
      session.deviceId > 0
        ? `id:${session.deviceId}`
        : `fp:${session.ip}|${session.lastActive}|${session.browserName}|${session.deviceName}`;

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const buildSessionsView = (
  currentSession: SessionItem | undefined,
  otherSessions: SessionItem[],
): SessionsView => {
  if (!currentSession) return { current: null, others: [] };

  const othersWithoutCurrent = otherSessions.filter(
    (session) => !isSameSession(session, currentSession),
  );

  let current = currentSession;
  let others = othersWithoutCurrent;

  // If backend gives low-quality "current", but there is a richer session with same IP in others,
  // prefer that richer record for display as current.
  if (isLowQualitySession(currentSession)) {
    const replacement = othersWithoutCurrent.find((session) => session.ip === currentSession.ip);
    if (replacement) {
      current = replacement;
      others = othersWithoutCurrent.filter((session) => !isSameSession(session, replacement));
    }
  }

  return {
    current,
    others: dedupeSessions(others),
  };
};
