'use client';

import type { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intlayer';
import { AppFrame } from '@layout-ui/app-frame';
import { AdminHeader } from '@/widgets/admin-header';
import { AdminSidebar } from '@/widgets/admin-sidebar';

export function AdminAppFrame({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { locale } = useLocale();
  const isSignInPage = pathname === `/${locale}/sign-in`;

  return (
    <AppFrame header={<AdminHeader />} sidebar={isSignInPage ? undefined : <AdminSidebar />}>
      {children}
    </AppFrame>
  );
}
