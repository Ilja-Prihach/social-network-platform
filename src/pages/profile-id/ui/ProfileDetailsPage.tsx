'use client';

import { useEffect, useMemo, useRef } from 'react';
import styles from './ProfileDetailsPage.module.scss';
import { usePublicProfileQuery, useProfilePostsInfiniteQuery } from '@/entities/profile';
import { useMe } from '@/features/auth/model/useMe';
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';
import { Button } from '@/shared/ui/Button';
import { PostCard } from '@/widgets/post-card';
import type { PostCardVM } from '@/widgets/post-card';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import type { ProfileAvatar } from '@/entities/profile';

const formatCount = (value: number) => new Intl.NumberFormat('en-US').format(value);
const AVATAR_FALLBACK = '/mock/Avatar1.jpg';

const pickProfileAvatar = (avatars?: ProfileAvatar[]) => {
  if (!avatars?.length) return AVATAR_FALLBACK;
  return avatars.find((avatar) => avatar.width === 192)?.url ?? avatars[0].url ?? AVATAR_FALLBACK;
};

export function ProfileDetailsPage() {
  const params = useParams<{ id?: string | string[] }>();
  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const profileId = Number(idParam);
  const isValidProfileId = Number.isFinite(profileId) && profileId > 0;
  const { data: me } = useMe();
  const profileQuery = usePublicProfileQuery(isValidProfileId ? profileId : null);
  const postsQuery = useProfilePostsInfiniteQuery(
    isValidProfileId ? profileId : null,
    isValidProfileId,
  );

  const isOwner = me?.userId === profileId;
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = postsQuery;

  const posts = useMemo(() => {
    const profilePosts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
    const authorName = profileQuery.data?.userName ?? 'UserName';
    const authorAvatar = pickProfileAvatar(profileQuery.data?.avatars);

    return profilePosts.map(
      (post): PostCardVM => ({
        post: {
          id: post.id,
          authorId: String(profileId),
          createdAt: post.createdAt,
          text: post.text,
          media: post.media,
        },
        author: {
          id: String(profileId),
          username: authorName,
          avatarUrl: authorAvatar,
        },
      }),
    );
  }, [postsQuery.data, profileId, profileQuery.data]);

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

  if (!isValidProfileId) {
    return (
      <section className={styles.page}>
        <div className={styles.state}>Invalid profile id.</div>
      </section>
    );
  }

  const profile = profileQuery.data;
  const avatarUrl = pickProfileAvatar(profile?.avatars);

  return (
    <section className={styles.page}>
      <div className={styles.layout}>
        {me && (
          <aside className={styles.sidebar}>
            <Sidebar />
          </aside>
        )}

        <main
          ref={scrollContainerRef}
          className={`${styles.main} ${me ? styles.main_with_sidebar : ''}`}
        >
          {profileQuery.isPending && <div className={styles.state}>Loading profile...</div>}
          {profileQuery.isError && <div className={styles.state}>Failed to load profile.</div>}

          {profile && (
            <>
              <div className={styles.profile_header}>
                <div className={styles.avatar_wrap}>
                  <Image
                    src={avatarUrl}
                    alt={profile.userName}
                    width={192}
                    height={192}
                    className={styles.avatar}
                  />
                </div>

                <div className={styles.profile_meta}>
                  <div className={styles.profile_row}>
                    <h1 className={styles.title}>{profile.userName}</h1>
                    {isOwner && (
                      <Button
                        href="/settings"
                        variant="secondary"
                        className={styles.settings_button}
                      >
                        Profile Settings
                      </Button>
                    )}
                  </div>

                  <ul className={styles.stats}>
                    <li className={styles.stat_item}>
                      <strong>{formatCount(profile.userMetadata.following)}</strong>
                      <span>Following</span>
                    </li>
                    <li className={styles.stat_item}>
                      <strong>{formatCount(profile.userMetadata.followers)}</strong>
                      <span>Followers</span>
                    </li>
                    <li className={styles.stat_item}>
                      <strong>{formatCount(profile.userMetadata.publications)}</strong>
                      <span>Publications</span>
                    </li>
                  </ul>

                  {profile.aboutMe && <p className={styles.about}>{profile.aboutMe}</p>}
                </div>
              </div>

              <div className={styles.posts_grid}>
                {posts.map((vm) => (
                  <PostCard key={vm.post.id} vm={vm} />
                ))}
              </div>

              {postsQuery.isPending && <div className={styles.state}>Loading posts...</div>}
              {!postsQuery.isPending && posts.length === 0 && (
                <div className={styles.state}>No posts yet.</div>
              )}
              {postsQuery.isFetchingNextPage && (
                <div className={styles.state}>Loading more posts...</div>
              )}
              <div className={styles.scroll_trigger} />
            </>
          )}
        </main>
      </div>
    </section>
  );
}
