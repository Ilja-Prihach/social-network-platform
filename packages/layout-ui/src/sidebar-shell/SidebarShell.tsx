import type { ReactNode } from 'react';
import styles from './SidebarShell.module.scss';

type SidebarShellProps = {
  primary?: ReactNode;
  secondary?: ReactNode;
  footer?: ReactNode;
};

export function SidebarShell({ primary, secondary, footer }: SidebarShellProps) {
  return (
    <nav className={styles.sidebar}>
      {primary ? <ul className={styles.sidebar_nav}>{primary}</ul> : null}
      {secondary ? <ul className={styles.sidebar_tools}>{secondary}</ul> : null}
      {footer ? <ul className={styles.sidebar_logout}>{footer}</ul> : null}
    </nav>
  );
}
