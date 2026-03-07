'use client';

import { useEffect, useMemo, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './ProfileDetailsPage.module.scss';
import {
  usePublicProfileQuery,
  useProfilePostsInfiniteQuery,
  type ProfileAvatar,
  type ProfilePostsPage,
  type PublicProfile,
} from '@/entities/profile';
import { useMe } from '@/features/auth/model/useMe';
import { usePostViewer } from '@/features/post/open-post-viewer';
import { mapProfilePostToViewerPost } from '../model/mapProfilePostToViewerPost';
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
  const router = useRouter();
  const pathname = usePathname();
  const safePathname = pathname ?? `/profile/${profileId}`;
  const searchParams = useSearchParams();
  const selectedPostIdFromUrl = searchParams?.get('postId');
  const profileQuery = usePublicProfileQuery(profileId, initialProfile);
  const postsQuery = useProfilePostsInfiniteQuery(profileId, true, initialPostsPage);

  const isOwner = me?.userId === profileId;
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
  const viewer = usePostViewer<ProfilePostsPage['items'][number]>({
    items: posts,
    currentUserId: me?.userId,
    getId: (item) => item.id,
    mapToPost: mapProfilePostToViewerPost,
    getAuthorId: () => profileId,
    getIsFriendPost: () => Boolean(profile?.isFollowing && profile?.isFollowedBy),
  });

  useEffect(() => {
    if (!selectedPostIdFromUrl) {
      return;
    }
    viewer.openPost(selectedPostIdFromUrl);
  }, [selectedPostIdFromUrl, viewer]);

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
                  <div
                    role="button"
                    tabIndex={0}
                    className={styles.post_open}
                    onClick={() => {
                      viewer.openPost(post.id);
                      const next = new URLSearchParams(searchParams?.toString());
                      next.set('postId', post.id);
                      router.replace(`${safePathname}?${next.toString()}`);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        viewer.openPost(post.id);
                        const next = new URLSearchParams(searchParams?.toString());
                        next.set('postId', post.id);
                        router.replace(`${safePathname}?${next.toString()}`);
                      }
                    }}
                    aria-label={`Open ${post.userName} post`}
                  >
                    <div className={styles.post_media}>
                      <PostMediaCarousel media={post.media} />
                    </div>
                  </div>
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
    </section>
  );
}
