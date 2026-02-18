'use client';

import { useMemo } from 'react';
import { useDevicesSessions } from '../model/useDevicesSessions';
import {
  buildSessionsView,
  formatLastActive,
  toSessionTitle,
  type DevicesTexts as SessionViewTexts,
} from '../model/lib/sessionViewModel';
import type { SessionItem } from '@/entities/auth/api/authApi';
import { Button } from '@/shared/ui/Button';
import { useDictionary } from 'next-intlayer';
import devicesSettingsContent from '../devices-settings.content';
import styles from './DevicesSettingsPage.module.scss';

type DevicesPageTexts = SessionViewTexts & {
  current: string;
  ipLabel: string;
  typeLabel: string;
  lastVisitLabel: string;
  terminate: string;
  activeSessions: string;
  terminateAllOtherSessions: string;
  loadingSessions: string;
  failedToLoadSessions: string;
  terminatedSessions: string;
  terminatedSessionsHistoryUnavailable: string;
};

const render_session = (
  session: SessionItem,
  is_current: boolean,
  texts: DevicesPageTexts,
  on_terminate?: (deviceId: number) => void,
) => (
  <article key={`${session.deviceId}-${session.lastActive}`} className={styles.session_card}>
    <div className={styles.session_main}>
      <div className={styles.session_title_row}>
        <h3 className={styles.session_device}>{toSessionTitle(session, texts)}</h3>
        {is_current && <span className={styles.current_badge}>{texts.current}</span>}
      </div>
      <p className={styles.session_meta}>
        {texts.ipLabel}: {session.ip || texts.unknown}
      </p>
      <p className={styles.session_meta}>
        {texts.typeLabel}: {session.deviceType || texts.unknown}
      </p>
      <p className={styles.session_meta}>
        {texts.lastVisitLabel}: {formatLastActive(session.lastActive, texts)}
      </p>
    </div>

    {on_terminate && (
      <Button
        type="button"
        variant="text"
        className={styles.terminate_button}
        disabled={session.deviceId <= 0}
        onClick={() => on_terminate(session.deviceId)}
      >
        {texts.terminate}
      </Button>
    )}
  </article>
);

export function DevicesSettingsPage() {
  const content = useDictionary(devicesSettingsContent) as DevicesPageTexts;

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

  const sessions_view = useMemo(
    () => buildSessionsView(currentSession, otherSessions),
    [currentSession, otherSessions],
  );

  return (
    <section className={styles.page}>
      <header className={styles.section_header}>
        <h2 className={styles.section_title}>{content.activeSessions}</h2>
        <Button
          type="button"
          variant="text"
          className={styles.terminate_all_button}
          onClick={terminateAllOtherSessions}
          disabled={!sessions_view.others.length || isTerminatingAll || isTerminatingOne}
        >
          {content.terminateAllOtherSessions}
        </Button>
      </header>

      {isLoading && <p className={styles.state_text}>{content.loadingSessions}</p>}
      {isError && <p className={styles.state_text}>{content.failedToLoadSessions}</p>}
      {!isLoading && !isError && sessions_view.current && (
        <div className={styles.sessions_list}>
          {render_session(sessions_view.current, true, content)}
          {sessions_view.others.map((session) =>
            render_session(session, false, content, terminateSession),
          )}
        </div>
      )}

      <header className={styles.section_header}>
        <h2 className={styles.section_title}>{content.terminatedSessions}</h2>
      </header>

      <p className={styles.state_text}>{content.terminatedSessionsHistoryUnavailable}</p>
    </section>
  );
}
