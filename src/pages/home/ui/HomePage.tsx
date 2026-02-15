'use client';

import { Suspense } from 'react';
import styles from './HomePage.module.scss';
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';
import { PostCard } from '@/widgets/post-card';
import { PeopleCounter } from '@/widgets/people-counter';
import { useMe } from '@/features/auth/model/useMe';
import { HomeQueryBridge } from './HomeQueryBridge';
import { useHomePosts } from '../model/useHomePosts';

export function HomePage() {
  const { data: me, isLoading } = useMe();
  const { data: items = [] } = useHomePosts();

  return (
    <>
      <Suspense fallback={null}>
        <HomeQueryBridge />
      </Suspense>
      <section className={styles.page}>
        <div className={styles.content}>
          {!isLoading && me && (
            <aside className={styles.sidebar}>
              <Sidebar />
            </aside>
          )}
          <div className={styles.user_count}>
            <PeopleCounter />
          </div>

          <main className={styles.main}>
            <div className={styles.grid}>
              {items.map((vm) => (
                <PostCard key={vm.post.id} vm={vm} />
              ))}
            </div>
          </main>
        </div>
      </section>
    </>
  );
}
