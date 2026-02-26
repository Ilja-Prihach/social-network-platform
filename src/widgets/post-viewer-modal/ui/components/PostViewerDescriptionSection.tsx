import Image from 'next/image';
import styles from './PostViewerDescriptionSection.module.scss';

type PostViewerDescriptionSectionProps = {
  isEditMode: boolean;
  avatarUrl: string;
  userName: string;
  descriptionForView: string;
  descriptionDraft: string;
  onDescriptionDraftChange: (value: string) => void;
};

export function PostViewerDescriptionSection({
  isEditMode,
  avatarUrl,
  userName,
  descriptionForView,
  descriptionDraft,
  onDescriptionDraftChange,
}: PostViewerDescriptionSectionProps) {
  const canRenderCaption = Boolean(descriptionForView.trim());

  return (
    <div className={styles.comments}>
      {isEditMode ? (
        <article className={styles.comment_row}>
          <div className={styles.comment_avatar}>
            <Image src={avatarUrl} alt={userName} fill sizes="36px" />
          </div>
          <div className={styles.comment_text}>
            <p>
              <span className={styles.comment_author}>{userName}</span>
            </p>
            <textarea
              className={styles.edit_description_input}
              value={descriptionDraft}
              onChange={(event) => onDescriptionDraftChange(event.target.value)}
              placeholder="Edit description..."
              rows={4}
            />
          </div>
        </article>
      ) : (
        canRenderCaption && (
          <article className={styles.comment_row}>
            <div className={styles.comment_avatar}>
              <Image src={avatarUrl} alt={userName} fill sizes="36px" />
            </div>
            <p className={styles.comment_text}>
              <span className={styles.comment_author}>{userName}</span> {descriptionForView}
            </p>
          </article>
        )
      )}
    </div>
  );
}
