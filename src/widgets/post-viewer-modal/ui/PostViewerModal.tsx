'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { PostViewerPost } from '@/entities/post';
import { Icon } from '@/shared/ui/Icon';
import styles from './PostViewerModal.module.scss';
import { usePostViewerActions } from '@/features/post/post-actions';
import { PostViewerHeaderActions } from './components/PostViewerHeaderActions';
import { PostViewerDescriptionSection } from './components/PostViewerDescriptionSection';
import { PostViewerFooter } from './components/PostViewerFooter';

const AVATAR_FALLBACK = '/mock/Avatar1.jpg';

type PostViewerModalProps = {
  post: PostViewerPost | null;
  isOwner: boolean;
  isFriendPost: boolean;
  onClose: () => void;
};

export function PostViewerModal({ post, isOwner, isFriendPost, onClose }: PostViewerModalProps) {
  const [mediaIndex, setMediaIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    menuItems,
    isActionPending,
    isEditMode,
    descriptionDraft,
    setDescriptionDraft,
    descriptionForView,
    handleSaveChanges,
    handleRequestExitEditMode,
    handleRequestClose,
  } = usePostViewerActions({
    post,
    isOwner,
    isFriendPost,
    onClose,
  });

  useEffect(() => {
    if (!post) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleRequestClose();
      }
    };

    window.addEventListener('keydown', onEsc);

    return () => window.removeEventListener('keydown', onEsc);
  }, [handleRequestClose, post]);

  const media = post?.media ?? [];
  const hasManyMedia = media.length > 1;
  const safeMediaIndex = clamp(mediaIndex, 0, Math.max(0, media.length - 1));
  const currentMedia = media[safeMediaIndex];

  if (!post) return null;

  const avatarUrl = post.avatarOwner || AVATAR_FALLBACK;
  const createdAtLabel = formatPostDate(post.createdAt);
  const likeIconId = post.isLiked ? 'heart' : 'heart-outline';
  const likesCount = typeof post.likesCount === 'number' ? post.likesCount : null;
  const likesAvatars = (post.likesAvatars ?? []).slice(0, 3);

  const goPrev = () => setMediaIndex((prev) => (prev <= 0 ? media.length - 1 : prev - 1));
  const goNext = () => setMediaIndex((prev) => (prev >= media.length - 1 ? 0 : prev + 1));

  return (
    <div className={styles.overlay} role="dialog" aria-modal onClick={handleRequestClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className={styles.close_button}
          aria-label="Close"
          onClick={handleRequestClose}
        >
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

            <PostViewerHeaderActions
              isEditMode={isEditMode}
              isActionPending={isActionPending}
              isMenuOpen={isMenuOpen}
              menuItems={menuItems}
              onToggleMenu={() => setIsMenuOpen((value) => !value)}
              onCloseMenu={() => setIsMenuOpen(false)}
              onRequestExitEditMode={handleRequestExitEditMode}
            />
          </header>

          <PostViewerDescriptionSection
            isEditMode={isEditMode}
            avatarUrl={avatarUrl}
            userName={post.userName}
            descriptionForView={descriptionForView}
            descriptionDraft={descriptionDraft}
            onDescriptionDraftChange={setDescriptionDraft}
          />

          <PostViewerFooter
            isEditMode={isEditMode}
            isActionPending={isActionPending}
            likeIconId={likeIconId}
            likesCount={likesCount}
            likesAvatars={likesAvatars}
            createdAtLabel={createdAtLabel}
            onSaveChanges={handleSaveChanges}
          />
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
