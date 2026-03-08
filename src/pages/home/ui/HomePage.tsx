'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getLocalizedUrl } from 'intlayer';
import { useLocale } from 'next-intlayer';
import styles from './HomePage.module.scss';
import { PostCard } from '@/widgets/post-card';
import { PeopleCounter } from '@/widgets/people-counter';
import { HomeQueryBridge } from './HomeQueryBridge';
import { useHomePosts } from '../model/useHomePosts';
import type { PostCardVM } from '@/widgets/post-card';

type Props = {
  initialPosts?: PostCardVM[];
  initialNextCursorPostId?: number | null;
  initialPeopleCount?: number | null;
  mode?: 'preview' | 'feed';
};

export function HomePage({
  initialPosts = [],
  initialNextCursorPostId = null,
  initialPeopleCount = null,
  mode = 'preview',
}: Props) {
  const router = useRouter();
  const { locale } = useLocale();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFeed = mode === 'feed';
  const postsQuery = useHomePosts(initialPosts, initialNextCursorPostId, {
    enabled: isFeed,
    mode,
  });
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = postsQuery;
  const items = useMemo(
    () => postsQuery.data?.pages.flatMap((page) => page.items) ?? initialPosts,
    [initialPosts, postsQuery.data],
  );
  const shouldShowPostSkeleton = postsQuery.isLoading && items.length === 0;

  useEffect(() => {
    if (!isFeed) return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || !hasNextPage || isFetchingNextPage) {
          return;
        }

        fetchNextPage();
      },
      {
        rootMargin: '300px 0px',
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFeed, isFetchingNextPage]);

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
                : items.map((vm) => {
                    const profilePath = getLocalizedUrl(`/profile/${vm.author.id}`, locale);
                    const next = new URLSearchParams();
                    next.set('postId', vm.post.id);
                    next.set('from', 'home');
                    const href = `${profilePath}?${next.toString()}`;

                    return (
                      <PostCard
                        key={vm.post.id}
                        vm={vm}
                        onHover={() => router.prefetch(href)}
                        onOpen={() => {
                          router.push(href);
                        }}
                      />
                    );
                  })}
            </div>
            {isFeed && isFetchingNextPage && (
              <div className={styles.load_more}>Loading more posts...</div>
            )}
            {isFeed && hasNextPage && (
              <div ref={loadMoreRef} className={styles.scroll_trigger} aria-hidden />
            )}
          </main>
        </div>
      </section>
    </>
  );
}
