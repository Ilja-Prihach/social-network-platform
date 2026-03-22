'use client';

import type { PropsWithChildren } from 'react';
import { AppFrame } from '@layout-ui/app-frame';
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

  return (
    <>
      <Alert />
      <SvgSprite />
      <ModalWindow />
      <AppFrame
        header={<Header initialMe={initialMe} />}
        sidebar={showSidebar ? <Sidebar /> : undefined}
        sidebarFallback={
          showSidebarSkeleton ? (
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
          ) : undefined
        }
      >
        {children}
      </AppFrame>
    </>
  );
};
