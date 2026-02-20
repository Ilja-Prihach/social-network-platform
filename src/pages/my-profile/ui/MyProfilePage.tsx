'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './MyProfilePage.module.scss';
import { useMe } from '@/features/auth/model/useMe';
import { Button } from '@/shared/ui/Button';

export function MyProfilePage() {
  const router = useRouter();
  const { data: me, isPending } = useMe();

  console.log(me);

  useEffect(() => {
    if (!me?.userId) return;
    router.replace(`/profile/${me.userId}`);
  }, [me?.userId, router]);

  if (isPending || me?.userId) {
    return (
      <section className={styles.page}>
        <p className={styles.description}>Loading your profile...</p>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Authorization required</h1>
      <p className={styles.description}>Sign in to open your personal profile page.</p>
      <Button href="/sign-in" variant="primary">
        Sign In
      </Button>
    </section>
  );
}
