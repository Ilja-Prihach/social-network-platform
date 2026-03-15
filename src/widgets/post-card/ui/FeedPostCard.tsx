'use client';

import { useMemo, useState } from 'react';
import { useDictionary, useLocale } from 'next-intlayer';
import type { PostViewerPost } from '@/entities/post';
import { Icon } from '@/shared/ui/Icon';
import { UserBadge } from '@/entities/user';
import { PostMediaCarousel } from '@/entities/post/ui/PostMediaCarousel';
import { usePostViewerActions } from '@/features/post/post-actions';
import { useMe } from '@/features/auth/model/useMe';
import type { PostCardVM } from '../model/types';
import feedPostCardContent from '../feed-post-card.content';
import s from './FeedPostCard.module.scss';

type Props = {
  vm: PostCardVM;
  onOpen?: () => void;
  onHover?: () => void;
  profileHref?: string;
};

export function FeedPostCard({ vm, onOpen, onHover, profileHref }: Props) {
  const { post, author, likesCount, isLiked } = vm;
  const dictionary = useDictionary(feedPostCardContent);
  const { locale } = useLocale();
  const { data: me, isPending: isAuthPending } = useMe();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isOwner = String(me?.userId ?? '') === author.id;
  const postForActions = useMemo<PostViewerPost>(
    () => ({
      id: post.id,
      createdAt: post.createdAt,
      text: post.text,
      userName: author.username,
      avatarOwner: author.avatarUrl,
      media: post.media,
      likesCount,
      isLiked,
    }),
    [author.avatarUrl, author.username, isLiked, likesCount, post],
  );
  const {
    menuItems,
    isActionPending,
    isEditMode,
    descriptionDraft,
    setDescriptionDraft,
    descriptionForView,
    handleSaveChanges,
    handleRequestExitEditMode,
  } = usePostViewerActions({
    post: postForActions,
    isOwner,
    isFriendPost: false,
    onClose: () => {
      setIsMenuOpen(false);
    },
  });

  return (
    <article className={s.card}>
      <header className={s.header}>
        <UserBadge user={author} createdAt={post.createdAt} profileHref={profileHref} />
        <div className={s.header_actions}>
          {isAuthPending ? (
            <div className={s.actions_skeleton} aria-hidden />
          ) : isEditMode ? (
            <button
              type="button"
              className={s.more_button}
              aria-label={dictionary.exitEditMode.value}
              onClick={handleRequestExitEditMode}
            >
              <Icon iconId="close-outline" />
            </button>
          ) : (
            <>
              <button
                type="button"
                className={s.more_button}
                aria-label={dictionary.openPostActions.value}
                onClick={() => setIsMenuOpen((value) => !value)}
              >
                <Icon iconId="more-horizontal-outline" />
              </button>

              {isMenuOpen && (
                <div className={s.post_menu}>
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={s.post_menu_item}
                      onClick={() => {
                        setIsMenuOpen(false);
                        item.onClick?.();
                      }}
                      disabled={isActionPending}
                    >
                      <Icon iconId={item.iconId} className={s.post_menu_icon} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </header>

      <div
        role={onOpen ? 'button' : undefined}
        tabIndex={onOpen ? 0 : undefined}
        className={`${s.media} ${onOpen ? s.media_open : ''}`}
        onClick={onOpen}
        onMouseEnter={onHover}
        onFocus={onHover}
        onKeyDown={(event) => {
          if (!onOpen) return;
          if (event.key === 'Enter' || event.key === ' ') {
            onOpen();
          }
        }}
      >
        <PostMediaCarousel media={post.media} variant="feed" />
      </div>

      {isEditMode ? (
        <>
          <div className={s.body}>
            <p className={s.text}>
              <span className={s.username}>{author.username}</span>
            </p>
            <textarea
              className={s.edit_description_input}
              value={descriptionDraft}
              onChange={(event) => setDescriptionDraft(event.target.value)}
              placeholder={dictionary.editDescriptionPlaceholder.value}
              rows={4}
            />
          </div>

          <div className={`${s.comment_box} ${s.comment_box_edit}`}>
            <button
              type="button"
              className={s.save_button}
              onClick={handleSaveChanges}
              disabled={isActionPending}
            >
              {dictionary.saveChanges.value}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={s.actions}>
            <div className={s.actions_left}>
              <button
                type="button"
                className={s.icon_button}
                aria-label={dictionary.likePost.value}
              >
                <Icon iconId={isLiked ? 'heart' : 'heart-outline'} />
              </button>
              <button
                type="button"
                className={s.icon_button}
                aria-label={dictionary.viewComments.value}
              >
                <Icon iconId="message-circle-outline" />
              </button>
              <button
                type="button"
                className={s.icon_button}
                aria-label={dictionary.sharePost.value}
              >
                <Icon iconId="paper-plane-outline" />
              </button>
            </div>

            <button type="button" className={s.icon_button} aria-label={dictionary.savePost.value}>
              <Icon iconId="bookmark-outline" />
            </button>
          </div>

          <div className={s.body}>
            <p className={s.text}>
              <span className={s.username}>{author.username}</span>
              {descriptionForView ? ` ${descriptionForView}` : ''}
            </p>

            {typeof likesCount === 'number' && (
              <p className={s.likes}>
                {new Intl.NumberFormat(locale).format(likesCount)}{' '}
                <span className={s.likes_label}>{dictionary.likesLabel.value}</span>
              </p>
            )}

            <button type="button" className={s.comments_link}>
              {dictionary.viewAllComments.value}
            </button>
          </div>

          <div className={s.comment_box}>
            <input
              className={s.comment_input}
              type="text"
              placeholder={dictionary.addCommentPlaceholder.value}
            />
            <button type="button" className={s.publish_button}>
              {dictionary.publish.value}
            </button>
          </div>
        </>
      )}
    </article>
  );
}
