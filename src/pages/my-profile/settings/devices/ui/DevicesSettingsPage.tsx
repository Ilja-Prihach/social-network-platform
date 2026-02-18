'use client';

import { useMemo } from 'react';
import { useDevicesSessions } from '../model/useDevicesSessions';
import {
  buildSessionsView,
  formatLastActive,
  getSessionFingerprint,
  toSessionTitle,
  type DevicesTexts,
} from '../model/lib/sessionViewModel';
import type { SessionItem } from '@/entities/auth/api/authApi';
import { Button } from '@/shared/ui/Button';
import { useDictionary } from 'next-intlayer';
import devicesSettingsContent from '../devices-settings.content';
import styles from './DevicesSettingsPage.module.scss';

const toText = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    typeof (value as { value: unknown }).value === 'string'
  ) {
    return (value as { value: string }).value;
  }
  return '';
};

export function DevicesSettingsPage() {
  const content = useDictionary(devicesSettingsContent);
  const sessionTexts: DevicesTexts = {
    na: toText(content.na),
    unknown: toText(content.unknown),
    unknownBrowser: toText(content.unknownBrowser),
    unknownOs: toText(content.unknownOs),
    unknownDevice: toText(content.unknownDevice),
  };

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
          <article
            key={getSessionFingerprint(sessions_view.current)}
            className={styles.session_card}
          >
            <div className={styles.session_main}>
              <div className={styles.session_title_row}>
                <h3 className={styles.session_device}>
                  {toSessionTitle(sessions_view.current, sessionTexts)}
                </h3>
                <span className={styles.current_badge}>{content.current}</span>
              </div>
              <p className={styles.session_meta}>
                {content.ipLabel}: {sessions_view.current.ip || content.unknown}
              </p>
              <p className={styles.session_meta}>
                {content.lastVisitLabel}:{' '}
                {formatLastActive(sessions_view.current.lastActive, sessionTexts)}
              </p>
            </div>
          </article>
          {sessions_view.others.map((session: SessionItem) => (
            <article key={getSessionFingerprint(session)} className={styles.session_card}>
              <div className={styles.session_main}>
                <div className={styles.session_title_row}>
                  <h3 className={styles.session_device}>{toSessionTitle(session, sessionTexts)}</h3>
                </div>
                <p className={styles.session_meta}>
                  {content.ipLabel}: {session.ip || content.unknown}
                </p>
                <p className={styles.session_meta}>
                  {content.lastVisitLabel}: {formatLastActive(session.lastActive, sessionTexts)}
                </p>
              </div>

              <Button
                type="button"
                variant="text"
                className={styles.terminate_button}
                disabled={session.deviceId <= 0}
                onClick={() => terminateSession(session.deviceId)}
              >
                {content.terminate}
              </Button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
