'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useLocale } from 'next-intlayer';

import styles from './OAuthGooglePage.module.scss';
import { googleLogin } from '@/entities/auth/api/authApi';
import { useAuthStore } from '@/features/auth/model/store';
import { useMe } from '@/features/auth/model/useMe';
import { showAlert } from '@/shared/ui/Alert';

export function OAuthGooglePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale } = useLocale();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { refetch: refetchMe } = useMe();
  const didRun = useRef(false);

  const loginMutation = useMutation({
    mutationFn: googleLogin,
  });

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const error = searchParams.get('error');
    const code = searchParams.get('code') ?? '';

    const finish = async () => {
      if (error) {
        showAlert('Google OAuth was cancelled.', 'error');
        router.replace(`/${locale}/sign-in`);
        return;
      }

      if (!code) {
        showAlert('Missing Google authorization code.', 'error');
        router.replace(`/${locale}/sign-in`);
        return;
      }

      try {
        const origin = window.location.origin;
        const redirectUrl = `${origin}/${locale}/oauth/google`;
        await loginMutation.mutateAsync({ redirectUrl, code });

        setAuth(true);
        await refetchMe();
        showAlert('Login successful!', 'success');
        router.replace(`/${locale}/`);
      } catch {
        showAlert('Google OAuth failed. Please try again.', 'error');
        router.replace(`/${locale}/sign-in`);
      }
    };

    finish();
  }, [locale, loginMutation, refetchMe, router, searchParams, setAuth]);

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>Completing Google sign-in...</h2>
      </div>
    </section>
  );
}
