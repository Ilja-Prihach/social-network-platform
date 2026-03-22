import type { ReactNode } from 'react';
import styles from './HeaderShell.module.scss';

type HeaderShellProps = {
  logo: ReactNode;
  controls?: ReactNode;
};

export function HeaderShell({ logo, controls }: HeaderShellProps) {
  return (
    <header>
      <div className={styles.header}>
        <div className={styles.logo}>{logo}</div>
        {controls ? <div className={styles.controls}>{controls}</div> : null}
      </div>
    </header>
  );
}
