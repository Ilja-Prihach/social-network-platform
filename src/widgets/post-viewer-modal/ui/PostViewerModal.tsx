'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { PostViewerPost } from '@/entities/post';
import { Icon } from '@/shared/ui/Icon';
import { useDictionary, useLocale } from 'next-intlayer';
import styles from './PostViewerModal.module.scss';
import { usePostViewerActions } from '@/features/post/post-actions';
import { PostViewerHeaderActions } from './components/PostViewerHeaderActions';
import { PostViewerDescriptionSection } from './components/PostViewerDescriptionSection';
import { PostViewerFooter } from './components/PostViewerFooter';
import postViewerModalContent from '../post-viewer-modal.content';

const AVATAR_FALLBACK = '/mock/Avatar1.jpg';

type PostViewerModalProps = {
  post: PostViewerPost | null;
  isOwner: boolean;
  isFriendPost: boolean;
  onClose: () => void;
};

export function PostViewerModal({ post, isOwner, isFriendPost, onClose }: PostViewerModalProps) {
  const dictionary = useDictionary(postViewerModalContent);
  const { locale } = useLocale();
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

  const localeTag = getLocaleTag(locale);
  const avatarUrl = post.avatarOwner || AVATAR_FALLBACK;
  const createdAtLabel = formatPostDate(post.createdAt, localeTag);
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
          aria-label={dictionary.close.value}
          onClick={handleRequestClose}
        >
          <Icon iconId="close-outline" />
        </button>

        <div className={styles.media_column}>
          {currentMedia ? (
            <div className={styles.media_viewport}>
              <Image
                src={currentMedia.src}
                alt={currentMedia.alt || dictionary.postMediaAlt.value}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className={styles.media}
              />

              {hasManyMedia && (
                <>
                  <button
                    type="button"
                    className={`${styles.media_nav_button} ${styles.media_nav_button_prev}`}
                    aria-label={dictionary.previousMedia.value}
                    onClick={goPrev}
                  >
                    <Icon iconId="arrow-ios-back-outline" />
                  </button>
                  <button
                    type="button"
                    className={`${styles.media_nav_button} ${styles.media_nav_button_next}`}
                    aria-label={dictionary.nextMedia.value}
                    onClick={goNext}
                  >
                    <Icon iconId="arrow-ios-forward-outline" />
                  </button>
                </>
              )}

              {hasManyMedia && (
                <div
                  className={styles.media_dots}
                  role="tablist"
                  aria-label={dictionary.mediaPagination.value}
                >
                  {media.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`${dictionary.goToMediaPrefix.value} ${index + 1}`}
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
            <div className={styles.media_fallback}>{dictionary.noMedia.value}</div>
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
              exitEditModeLabel={dictionary.exitEditMode.value}
              openPostActionsLabel={dictionary.openPostActions.value}
            />
          </header>

          <PostViewerDescriptionSection
            isEditMode={isEditMode}
            avatarUrl={avatarUrl}
            userName={post.userName}
            descriptionForView={descriptionForView}
            descriptionDraft={descriptionDraft}
            onDescriptionDraftChange={setDescriptionDraft}
            editDescriptionPlaceholder={dictionary.editDescriptionPlaceholder.value}
          />

          <PostViewerFooter
            isEditMode={isEditMode}
            isActionPending={isActionPending}
            likeIconId={likeIconId}
            likesCount={likesCount}
            likesAvatars={likesAvatars}
            createdAtLabel={createdAtLabel}
            onSaveChanges={handleSaveChanges}
            saveChangesText={dictionary.saveChanges.value}
            likePostLabel={dictionary.likePost.value}
            sharePostLabel={dictionary.sharePost.value}
            savePostLabel={dictionary.savePost.value}
            likesLabel={dictionary.likesLabel.value}
            addCommentPlaceholder={dictionary.addCommentPlaceholder.value}
            publishText={dictionary.publish.value}
            localeTag={localeTag}
          />
        </aside>
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const LOCALE_TAGS: Record<string, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES',
  ru: 'ru-RU',
  it: 'it-IT',
  he: 'he-IL',
};

function getLocaleTag(locale: string) {
  return LOCALE_TAGS[locale] ?? LOCALE_TAGS.en;
}

function formatPostDate(value: string, localeTag: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(localeTag, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
