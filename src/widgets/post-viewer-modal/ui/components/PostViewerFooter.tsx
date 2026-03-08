import Image from 'next/image';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import styles from './PostViewerFooter.module.scss';

type PostViewerFooterProps = {
  isAuthPending?: boolean;
  isEditMode: boolean;
  isActionPending: boolean;
  likeIconId: string;
  likesCount: number | null;
  likesAvatars: string[];
  createdAtLabel: string;
  onSaveChanges: () => void;
  saveChangesText: string;
  likePostLabel: string;
  sharePostLabel: string;
  savePostLabel: string;
  likesLabel: string;
  addCommentPlaceholder: string;
  publishText: string;
  localeTag: string;
};

export function PostViewerFooter({
  isAuthPending,
  isEditMode,
  isActionPending,
  likeIconId,
  likesCount,
  likesAvatars,
  createdAtLabel,
  onSaveChanges,
  saveChangesText,
  likePostLabel,
  sharePostLabel,
  savePostLabel,
  likesLabel,
  addCommentPlaceholder,
  publishText,
  localeTag,
}: PostViewerFooterProps) {
  const hasLikesData = likesCount !== null || likesAvatars.length > 0;

  if (isAuthPending) {
    return (
      <>
        <div className={styles.actions}>
          <div className={styles.skeleton_row}>
            <span className={styles.skeleton_icon} />
            <span className={styles.skeleton_icon} />
            <span className={styles.skeleton_icon} />
            <span className={styles.skeleton_spacer} />
          </div>
          <div className={styles.skeleton_line} />
        </div>
        <div className={styles.add_comment}>
          <div className={styles.skeleton_input} />
          <div className={styles.skeleton_button} />
        </div>
      </>
    );
  }

  if (isEditMode) {
    return (
      <div className={`${styles.add_comment} ${styles.add_comment_edit}`}>
        <Button
          type="button"
          variant="primary"
          className={styles.save_button}
          onClick={onSaveChanges}
          disabled={isActionPending}
        >
          {saveChangesText}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.actions}>
        <div className={styles.reaction_buttons}>
          <button type="button" className={styles.icon_button} aria-label={likePostLabel}>
            <Icon iconId={likeIconId} />
          </button>
          <button type="button" className={styles.icon_button} aria-label={sharePostLabel}>
            <Icon iconId="paper-plane-outline" />
          </button>
          <button type="button" className={styles.icon_button} aria-label={savePostLabel}>
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
                {formatLikesCount(likesCount, localeTag)}{' '}
                <span className={styles.likes_highlight}>{likesLabel}</span>
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
          placeholder={addCommentPlaceholder}
        />
        <button type="button" className={styles.publish_button}>
          {publishText}
        </button>
      </div>
    </>
  );
}

function formatLikesCount(value: number, localeTag: string) {
  return new Intl.NumberFormat(localeTag).format(value);
}
