'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './HomePage.module.scss';
import { PostCard } from '@/widgets/post-card';
import { PeopleCounter } from '@/widgets/people-counter';
import { HomeQueryBridge } from './HomeQueryBridge';
import { useHomePosts } from '../model/useHomePosts';
import type { PostCardVM } from '@/widgets/post-card';
import {
  mapPostCardVmToViewerPost,
  getPostCardVmAuthorId,
} from '../model/mapPostCardVmToViewerPost';
import { useMe } from '@/features/auth/model/useMe';
import { usePostViewer } from '@/features/post/open-post-viewer';
import { PostViewerModal } from '@/widgets/post-viewer-modal';

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
  const { data: me } = useMe();
  const router = useRouter();
  const pathname = usePathname();
  const safePathname = pathname ?? '/';
  const searchParams = useSearchParams();
  const selectedPostIdFromUrl = searchParams?.get('postId');
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

  const viewer = usePostViewer<PostCardVM>({
    items,
    currentUserId: me?.userId,
    getId: (item) => item.post.id,
    mapToPost: mapPostCardVmToViewerPost,
    getAuthorId: getPostCardVmAuthorId,
  });

  useEffect(() => {
    if (!selectedPostIdFromUrl) {
      return;
    }
    viewer.openPost(selectedPostIdFromUrl);
  }, [selectedPostIdFromUrl, viewer]);

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
                : items.map((vm) => (
                    <PostCard
                      key={vm.post.id}
                      vm={vm}
                      onOpen={() => {
                        viewer.openPost(vm.post.id);
                        const next = new URLSearchParams(searchParams?.toString());
                        next.set('postId', vm.post.id);
                        router.replace(`${safePathname}?${next.toString()}`);
                      }}
                    />
                  ))}
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
      <PostViewerModal
        post={viewer.selectedPost}
        isOwner={viewer.isOwner}
        isFriendPost={viewer.isFriendPost}
        onClose={() => {
          viewer.closePost();
          const next = new URLSearchParams(searchParams?.toString());
          next.delete('postId');
          const nextQuery = next.toString();
          router.replace(nextQuery ? `${safePathname}?${nextQuery}` : safePathname);
        }}
      />
    </>
  );
}
