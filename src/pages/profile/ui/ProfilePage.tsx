'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProfilePage.module.scss';
import { useMe } from '@/features/auth/model/useMe';

export function ProfilePage() {
  const router = useRouter();
  const { data: me, isPending } = useMe();

  useEffect(() => {
    if (isPending) return;
    if (me?.userId) {
      router.replace(`/profile/${me.userId}`);
      return;
    }
    router.replace('/sign-in');
  }, [isPending, me?.userId, router]);

  return (
    <section className={styles.page}>
      <p className={styles.description}>Redirecting...</p>
    </section>
  );
}
