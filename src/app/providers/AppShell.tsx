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

export const AppShell = ({ children }: PropsWithChildren) => (
  <ReactQueryProvider>
    <AppShellContent>{children}</AppShellContent>
  </ReactQueryProvider>
);

const AppShellContent = ({ children }: PropsWithChildren) => {
  const { data: me, isLoading } = useMe();
  const showSidebar = !isLoading && Boolean(me);

  return (
    <>
      <Alert />
      <SvgSprite />
      <Header />
      <ModalWindow />
      <div className={styles.layout}>
        {showSidebar && (
          <aside className={styles.sidebar_slot}>
            <Sidebar />
          </aside>
        )}
        <div className={showSidebar ? styles.content_with_sidebar : styles.content}>{children}</div>
      </div>
    </>
  );
};
