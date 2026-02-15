'use client';

import { Suspense } from 'react';
import styles from './HomePage.module.scss';
import { PostCard } from '@/widgets/post-card';
import { PeopleCounter } from '@/widgets/people-counter';
import { HomeQueryBridge } from './HomeQueryBridge';
import { useHomePosts } from '../model/useHomePosts';
import type { PostCardVM } from '@/widgets/post-card';

type Props = {
  initialPosts?: PostCardVM[];
  initialPeopleCount?: number | null;
};

export function HomePage({ initialPosts = [], initialPeopleCount = null }: Props) {
  const { data: items = initialPosts, isLoading: isPostsLoading } = useHomePosts(initialPosts);
  const shouldShowPostSkeleton = isPostsLoading && items.length === 0;

  return (
    <>
      <Suspense fallback={null}>
        <HomeQueryBridge />
      </Suspense>
      <section className={styles.page}>
        <div className={styles.content}>
          <div className={styles.user_count}>
            <PeopleCounter initialCount={initialPeopleCount} />
          </div>

          <main className={styles.main}>
            <div className={styles.grid}>
              {shouldShowPostSkeleton
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
