'use client';

import { Suspense } from 'react';
import styles from './HomePage.module.scss';
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';
import { mockPosts } from '@/entities/post';
import { mockUsers } from '@/entities/user';
import { buildPostCards, PostCard } from '@/widgets/post-card';
import { CounterPeople } from '@/widgets/counterPeople';
import { useMe } from '@/features/auth/model/useMe';
import { HomeQueryBridge } from './HomeQueryBridge';

export function HomePage() {
  const items = buildPostCards(mockPosts, mockUsers);

  const { data: me, isLoading } = useMe();

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
            <CounterPeople />
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
