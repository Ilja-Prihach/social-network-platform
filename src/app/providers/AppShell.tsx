'use client';

import type { PropsWithChildren } from 'react';
import { ReactQueryProvider } from '@/app/providers/ReactQueryProvider';
import { Alert } from '@/shared/ui/Alert/Alert';
import { SvgSprite } from '@/shared/ui/SvgSprite';
import { ModalWindow } from '@/shared/ui/ModalWindow';
import { Header } from '@/widgets/header/ui/Header';
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';
import { useMe } from '@/features/auth/model/useMe';
import styles from './AppShell.module.scss';
import type { MeResponse } from '@/entities/user/api/me';

type AppShellProps = PropsWithChildren<{ initialMe?: MeResponse | null }>;

export const AppShell = ({ children, initialMe }: AppShellProps) => (
  <ReactQueryProvider>
    <AppShellContent initialMe={initialMe}>{children}</AppShellContent>
  </ReactQueryProvider>
);

type AppShellContentProps = PropsWithChildren<{ initialMe?: MeResponse | null }>;

const AppShellContent = ({ children, initialMe }: AppShellContentProps) => {
  const { data: me, isPending } = useMe();
  const resolvedMe = me ?? initialMe ?? undefined;
  const authResolved = initialMe !== undefined || !isPending;
  const showSidebar = Boolean(resolvedMe);
  const showSidebarSkeleton = !authResolved;
  const hasSidebar = showSidebar || showSidebarSkeleton;

  return (
    <>
      <Alert />
      <SvgSprite />
      <Header initialMe={initialMe} />
      <ModalWindow />
      <div className={styles.layout}>
        {hasSidebar && (
          <aside className={styles.sidebar_slot}>
            {showSidebar ? (
              <Sidebar />
            ) : (
              <div className={styles.sidebar_skeleton} aria-hidden>
                <div className={styles.sidebar_skeleton_group}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={`sidebar-main-${index}`} className={styles.sidebar_skeleton_item} />
                  ))}
                </div>
                <div className={styles.sidebar_skeleton_group}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={`sidebar-tools-${index}`} className={styles.sidebar_skeleton_item} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
        <div className={hasSidebar ? styles.content_with_sidebar : styles.content}>{children}</div>
      </div>
    </>
  );
};
