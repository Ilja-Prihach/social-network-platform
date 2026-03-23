'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intlayer';
import { hasAdminCredentials } from '@/shared/lib/adminAuthStorage';

type AdminRouteGuardProps = {
  children: ReactNode;
};

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocale();

  useEffect(() => {
    const isAuthorized = hasAdminCredentials();
    const isSignInPage = pathname === `/${locale}/sign-in`;

    if (!isAuthorized && !isSignInPage) {
      router.replace(`/${locale}/sign-in`);
      return;
    }

    if (isAuthorized && isSignInPage) {
      router.replace(`/${locale}/users`);
    }
  }, [locale, pathname, router]);

  return <>{children}</>;
}
