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
  const { data: me, isLoading: isMeLoading } = useMe();
  const { data: items = [], isLoading: isPostsLoading } = useHomePosts();

  return (
    <>
      <Suspense fallback={null}>
        <HomeQueryBridge />
      </Suspense>
      <section className={styles.page}>
        <div className={styles.content}>
          {!isMeLoading && me && (
            <aside className={styles.sidebar}>
              <Sidebar />
            </aside>
          )}
          <div className={styles.user_count}>
            <PeopleCounter />
          </div>

          <main className={styles.main}>
            <div className={styles.grid}>
              {isPostsLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={`post-skeleton-${index}`}
                      className={styles.post_skeleton}
                      aria-hidden
                    />
                  ))
                : items.map((vm) => <PostCard key={vm.post.id} vm={vm} />)}
            </div>
          </main>
        </div>
      </section>
    </>
  );
}
