'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import type { ProfilePostsPage } from '@/entities/profile';
import { Icon } from '@/shared/ui/Icon';
import styles from './PostViewerModal.module.scss';

const AVATAR_FALLBACK = '/mock/Avatar1.jpg';

type PostItem = ProfilePostsPage['items'][number];

type PostViewerModalProps = {
  post: PostItem | null;
  isOwner: boolean;
  isFriendPost: boolean;
  onClose: () => void;
};

export function PostViewerModal({ post, isOwner, isFriendPost, onClose }: PostViewerModalProps) {
  const [mediaIndex, setMediaIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!post) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onEsc);

    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose, post]);

  const media = post?.media ?? [];
  const hasManyMedia = media.length > 1;
  const safeMediaIndex = clamp(mediaIndex, 0, Math.max(0, media.length - 1));
  const currentMedia = media[safeMediaIndex];

  const menuItems = useMemo(() => {
    if (isOwner) {
      return [
        { label: 'Edit Post', iconId: 'edit-2-outline' },
        { label: 'Delete Post', iconId: 'trash-outline' },
      ];
    }

    if (isFriendPost) {
      return [
        { label: 'Unfollow', iconId: 'person-remove-outline' },
        { label: 'Copy Link', iconId: 'copy-outline' },
      ];
    }

    return [
      { label: 'Follow', iconId: 'person-add-outline' },
      { label: 'Copy Link', iconId: 'copy-outline' },
    ];
  }, [isFriendPost, isOwner]);

  if (!post) return null;

  const avatarUrl = post.avatarOwner || AVATAR_FALLBACK;
  const createdAtLabel = formatPostDate(post.createdAt);
  const canRenderCaption = Boolean(post.text?.trim());
  const likeIconId = post.isLiked ? 'heart' : 'heart-outline';
  const likesCount = typeof post.likesCount === 'number' ? post.likesCount : null;
  const likesAvatars = (post.likesAvatars ?? []).slice(0, 3);
  const hasLikesData = likesCount !== null || likesAvatars.length > 0;

  const goPrev = () => setMediaIndex((prev) => (prev <= 0 ? media.length - 1 : prev - 1));
  const goNext = () => setMediaIndex((prev) => (prev >= media.length - 1 ? 0 : prev + 1));

  return (
    <div className={styles.overlay} role="dialog" aria-modal onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <button type="button" className={styles.close_button} aria-label="Close" onClick={onClose}>
          <Icon iconId="close-outline" />
        </button>

        <div className={styles.media_column}>
          {currentMedia ? (
            <div className={styles.media_viewport}>
              <Image
                src={currentMedia.src}
                alt={currentMedia.alt || 'Post media'}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className={styles.media}
              />

              {hasManyMedia && (
                <>
                  <button
                    type="button"
                    className={`${styles.media_nav_button} ${styles.media_nav_button_prev}`}
                    aria-label="Previous media"
                    onClick={goPrev}
                  >
                    <Icon iconId="arrow-ios-back-outline" />
                  </button>
                  <button
                    type="button"
                    className={`${styles.media_nav_button} ${styles.media_nav_button_next}`}
                    aria-label="Next media"
                    onClick={goNext}
                  >
                    <Icon iconId="arrow-ios-forward-outline" />
                  </button>
                </>
              )}

              {hasManyMedia && (
                <div className={styles.media_dots} role="tablist" aria-label="Media pagination">
                  {media.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Go to media ${index + 1}`}
                      className={
                        index === safeMediaIndex ? styles.media_dot_active : styles.media_dot
                      }
                      onClick={() => setMediaIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.media_fallback}>No media</div>
          )}
        </div>

        <aside className={styles.sidebar}>
          <header className={styles.header}>
            <div className={styles.author}>
              <div className={styles.author_avatar}>
                <Image src={avatarUrl} alt={post.userName} fill sizes="36px" />
              </div>
              <p className={styles.author_name}>{post.userName}</p>
            </div>

            <div className={styles.header_actions}>
              <button
                type="button"
                className={styles.icon_button}
                aria-label="Open post actions"
                onClick={() => setIsMenuOpen((value) => !value)}
              >
                <Icon iconId="more-horizontal-outline" />
              </button>

              {isMenuOpen && (
                <div className={styles.post_menu}>
                  {menuItems.map((item) => (
                    <button key={item.label} type="button" className={styles.post_menu_item}>
                      <Icon iconId={item.iconId} className={styles.post_menu_icon} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </header>

          <div className={styles.comments}>
            {canRenderCaption && (
              <article className={styles.comment_row}>
                <div className={styles.comment_avatar}>
                  <Image src={avatarUrl} alt={post.userName} fill sizes="36px" />
                </div>
                <p className={styles.comment_text}>
                  <span className={styles.comment_author}>{post.userName}</span> {post.text}
                </p>
              </article>
            )}
          </div>

          <div className={styles.actions}>
            <div className={styles.reaction_buttons}>
              <button type="button" className={styles.icon_button} aria-label="Like post">
                <Icon iconId={likeIconId} />
              </button>
              <button type="button" className={styles.icon_button} aria-label="Share post">
                <Icon iconId="paper-plane-outline" />
              </button>
              <button type="button" className={styles.icon_button} aria-label="Save post">
                <Icon iconId="bookmark-outline" />
              </button>
            </div>

            {hasLikesData && (
              <div className={styles.likes_row}>
                {likesAvatars.length > 0 && (
                  <div className={styles.likes_avatars} aria-hidden>
                    {likesAvatars.map((avatar, index) => (
                      <div key={`${avatar}-${index}`} className={styles.likes_avatar}>
                        <Image src={avatar} alt="" fill sizes="24px" />
                      </div>
                    ))}
                  </div>
                )}
                {likesCount !== null && (
                  <p className={styles.likes}>
                    {formatLikesCount(likesCount)} &quot;
                    <span className={styles.likes_highlight}>Like</span>&quot;
                  </p>
                )}
              </div>
            )}
            <p className={styles.created_at}>{createdAtLabel}</p>
          </div>

          <div className={styles.add_comment}>
            <input
              className={styles.add_comment_input}
              type="text"
              placeholder="Add a Comment..."
            />
            <button type="button" className={styles.publish_button}>
              Publish
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatPostDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatLikesCount(value: number) {
  return new Intl.NumberFormat('ru-RU').format(value);
}
