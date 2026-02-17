'use client';

import { useMemo } from 'react';
import { useDevicesSessions } from '../model/useDevicesSessions';
import type { SessionItem } from '@/entities/auth/api/authApi';
import { Button } from '@/shared/ui/Button';
import styles from './DevicesSettingsPage.module.scss';

const format_last_active = (iso: string): string => {
  if (!iso) return 'n/a';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
};

const to_title = (session: SessionItem): string => {
  const browser =
    `${session.browserName || 'Unknown browser'} ${session.browserVersion || 'n/a'}`.trim();
  const os = `${session.osName || 'Unknown OS'} ${session.osVersion || 'n/a'}`.trim();
  const device = session.deviceName || 'Unknown device';
  return `${browser} on ${device} (${os})`;
};

const is_unknown_like = (value: string): boolean => {
  const normalized = (value || '').toLowerCase();
  return !normalized || normalized === 'n/a' || normalized.includes('unknown');
};

const is_low_quality_session = (session: SessionItem): boolean => {
  return (
    is_unknown_like(session.browserName) &&
    is_unknown_like(session.deviceName) &&
    is_unknown_like(session.osName)
  );
};

const is_same_session = (a: SessionItem, b: SessionItem): boolean => {
  if (a.deviceId > 0 && b.deviceId > 0) return a.deviceId === b.deviceId;
  return a.ip === b.ip && a.lastActive === b.lastActive;
};

const dedupe_sessions = (sessions: SessionItem[]): SessionItem[] => {
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

const render_session = (
  session: SessionItem,
  is_current: boolean,
  on_terminate?: (deviceId: number) => void,
) => (
  <article key={`${session.deviceId}-${session.lastActive}`} className={styles.session_card}>
    <div className={styles.session_main}>
      <div className={styles.session_title_row}>
        <h3 className={styles.session_device}>{to_title(session)}</h3>
        {is_current && <span className={styles.current_badge}>Current</span>}
      </div>
      <p className={styles.session_meta}>IP: {session.ip || 'unknown'}</p>
      <p className={styles.session_meta}>Type: {session.deviceType || 'unknown'}</p>
      <p className={styles.session_meta}>Last visit: {format_last_active(session.lastActive)}</p>
    </div>

    {on_terminate && (
      <Button
        type="button"
        variant="text"
        className={styles.terminate_button}
        onClick={() => on_terminate(session.deviceId)}
      >
        Terminate
      </Button>
    )}
  </article>
);

export function DevicesSettingsPage() {
  const {
    currentSession,
    otherSessions,
    isLoading,
    isError,
    terminateAllOtherSessions,
    terminateSession,
    isTerminatingAll,
    isTerminatingOne,
  } = useDevicesSessions();

  const sessions_view = useMemo(() => {
    if (!currentSession) {
      return { current: null as SessionItem | null, others: [] as SessionItem[] };
    }

    const others_without_current = otherSessions.filter(
      (session) => !is_same_session(session, currentSession),
    );

    let current = currentSession;
    let others = others_without_current;

    // If backend gives low-quality "current", but there is a richer session with same IP in others,
    // prefer that richer record for display as current.
    if (is_low_quality_session(currentSession)) {
      const replacement = others_without_current.find(
        (session) => session.ip === currentSession.ip,
      );
      if (replacement) {
        current = replacement;
        others = others_without_current.filter((session) => !is_same_session(session, replacement));
      }
    }

    return {
      current,
      others: dedupe_sessions(others),
    };
  }, [currentSession, otherSessions]);

  return (
    <section className={styles.page}>
      <header className={styles.section_header}>
        <h2 className={styles.section_title}>Active sessions</h2>
        <Button
          type="button"
          variant="text"
          className={styles.terminate_all_button}
          onClick={terminateAllOtherSessions}
          disabled={!sessions_view.others.length || isTerminatingAll || isTerminatingOne}
        >
          Terminate all other sessions
        </Button>
      </header>

      {isLoading && <p className={styles.state_text}>Loading sessions...</p>}
      {isError && <p className={styles.state_text}>Failed to load sessions.</p>}
      {!isLoading && !isError && sessions_view.current && (
        <div className={styles.sessions_list}>
          {render_session(sessions_view.current, true)}
          {sessions_view.others.map((session) => render_session(session, false, terminateSession))}
        </div>
      )}

      <header className={styles.section_header}>
        <h2 className={styles.section_title}>Terminated sessions</h2>
      </header>

      <p className={styles.state_text}>
        Backend currently does not return terminated sessions history.
      </p>
    </section>
  );
}
