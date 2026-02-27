import Image from 'next/image';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import styles from './PostViewerFooter.module.scss';

type PostViewerFooterProps = {
  isEditMode: boolean;
  isActionPending: boolean;
  likeIconId: string;
  likesCount: number | null;
  likesAvatars: string[];
  createdAtLabel: string;
  onSaveChanges: () => void;
};

export function PostViewerFooter({
  isEditMode,
  isActionPending,
  likeIconId,
  likesCount,
  likesAvatars,
  createdAtLabel,
  onSaveChanges,
}: PostViewerFooterProps) {
  const hasLikesData = likesCount !== null || likesAvatars.length > 0;

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
          Save Changes
        </Button>
      </div>
    );
  }

  return (
    <>
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
                <span className={styles.likes_highlight}>Like</span>
                &quot;
              </p>
            )}
          </div>
        )}
        <p className={styles.created_at}>{createdAtLabel}</p>
      </div>

      <div className={styles.add_comment}>
        <input className={styles.add_comment_input} type="text" placeholder="Add a Comment..." />
        <button type="button" className={styles.publish_button}>
          Publish
        </button>
      </div>
    </>
  );
}

function formatLikesCount(value: number) {
  return new Intl.NumberFormat('ru-RU').format(value);
}
