import type { PropsWithChildren, ReactNode } from 'react';
import styles from './AppFrame.module.scss';

type AppFrameProps = PropsWithChildren<{
  header: ReactNode;
  sidebar?: ReactNode;
  sidebarFallback?: ReactNode;
}>;

export function AppFrame({ header, sidebar, sidebarFallback, children }: AppFrameProps) {
  const asideContent = sidebar ?? sidebarFallback;
  const hasSidebar = Boolean(asideContent);

  return (
    <>
      {header}
      <div className={styles.layout}>
        {hasSidebar ? <aside className={styles.sidebar_slot}>{asideContent}</aside> : null}
        <div className={hasSidebar ? styles.content_with_sidebar : styles.content}>{children}</div>
      </div>
    </>
  );
}
