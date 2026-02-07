'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useLocale } from 'next-intlayer';

import styles from './OAuthGithubPage.module.scss';
import { acceptGithubAccessToken, githubUpdateTokens } from '@/entities/auth/api/authApi';
import { useAuthStore } from '@/features/auth/model/store';
import { useMe } from '@/features/auth/model/useMe';
import { showAlert } from '@/shared/ui/Alert';

export function OAuthGithubPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale } = useLocale();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { refetch: refetchMe } = useMe();
  const didRun = useRef(false);

  const acceptMutation = useMutation({
    mutationFn: acceptGithubAccessToken,
  });

  const updateTokensMutation = useMutation({
    mutationFn: githubUpdateTokens,
  });

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const accessToken = searchParams.get('accessToken') ?? searchParams.get('access_token') ?? '';

    const finish = async () => {
      try {
        try {
          await updateTokensMutation.mutateAsync();
        } catch {
          if (accessToken) {
            await acceptMutation.mutateAsync({ accessToken });
          } else {
            throw new Error('Missing refresh token');
          }
        }

        setAuth(true);
        await refetchMe();
        showAlert('Login successful!', 'success');
        router.replace(`/${locale}/`);
      } catch {
        showAlert('GitHub OAuth failed. Please try again.', 'error');
        router.replace(`/${locale}/sign-in`);
      }
    };

    finish();
  }, [acceptMutation, locale, refetchMe, router, searchParams, setAuth, updateTokensMutation]);

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>Completing GitHub sign-in...</h2>
      </div>
    </section>
  );
}
