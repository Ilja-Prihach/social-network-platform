'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './ProfileDetailsPage.module.scss';
import {
  usePublicProfileQuery,
  useProfilePostsInfiniteQuery,
  type ProfileAvatar,
  type ProfilePostsPage,
  type PublicProfile,
} from '@/entities/profile';
import { useMe } from '@/features/auth/model/useMe';
import { ProfileHeader } from '@/widgets/profile-header';
import { PostMediaCarousel } from '@/entities/post';
import { PostViewerModal } from '@/widgets/post-viewer-modal';

const AVATAR_FALLBACK = '/mock/Avatar1.jpg';

const pickProfileAvatar = (avatars?: ProfileAvatar[]) => {
  if (!avatars?.length) return AVATAR_FALLBACK;
  return avatars.find((avatar) => avatar.width === 192)?.url ?? avatars[0].url ?? AVATAR_FALLBACK;
};

type ProfileDetailsPageClientProps = {
  profileId: number;
  initialProfile: PublicProfile;
  initialPostsPage: ProfilePostsPage;
};

export function ProfileDetailsPageClient({
  profileId,
  initialProfile,
  initialPostsPage,
}: ProfileDetailsPageClientProps) {
  const { data: me } = useMe();
  const profileQuery = usePublicProfileQuery(profileId, initialProfile);
  const postsQuery = useProfilePostsInfiniteQuery(profileId, true, initialPostsPage);

  const isOwner = me?.userId === profileId;
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = postsQuery;

  const posts = useMemo(
    () => postsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [postsQuery.data],
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const maybeLoadMore = () => {
      if (!hasNextPage || isFetchingNextPage) return;

      const distanceToBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      if (distanceToBottom <= 260) {
        fetchNextPage();
      }
    };

    const raf = requestAnimationFrame(maybeLoadMore);
    container.addEventListener('scroll', maybeLoadMore, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener('scroll', maybeLoadMore);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, posts.length]);

  const profile = profileQuery.data ?? initialProfile;
  const avatarUrl = pickProfileAvatar(profile.avatars);
  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? null,
    [posts, selectedPostId],
  );
  const isFriendPost = Boolean(profile?.isFollowing && profile?.isFollowedBy);

  return (
    <section className={styles.page}>
      <div className={styles.layout}>
        <main
          ref={scrollContainerRef}
          className={`${styles.main} ${me ? styles.main_with_sidebar : ''}`}
        >
          <div className={styles.content}>
            {profileQuery.isError && !profile && (
              <div className={styles.state}>Failed to load profile.</div>
            )}

            <ProfileHeader profile={profile} avatarUrl={avatarUrl} isOwner={isOwner} />

            <div className={styles.posts_grid}>
              {posts.map((post) => (
                <article key={post.id} className={styles.post_item}>
                  <button
                    type="button"
                    className={styles.post_open}
                    onClick={() => setSelectedPostId(post.id)}
                    aria-label={`Open ${post.userName} post`}
                  >
                    <div className={styles.post_media}>
                      <PostMediaCarousel media={post.media} />
                    </div>
                  </button>
                </article>
              ))}
            </div>

            {postsQuery.isPending && <div className={styles.state}>Loading posts...</div>}
            {!postsQuery.isPending && posts.length === 0 && (
              <div className={styles.state}>No posts yet.</div>
            )}
            {postsQuery.isFetchingNextPage && (
              <div className={styles.state}>Loading more posts...</div>
            )}
          </div>
          <div className={styles.scroll_trigger} />
        </main>
      </div>
      <PostViewerModal
        post={selectedPost}
        isOwner={Boolean(isOwner)}
        isFriendPost={isFriendPost}
        onClose={() => setSelectedPostId(null)}
      />
    </section>
  );
}
