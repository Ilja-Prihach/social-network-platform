import { ChangeEventHandler, RefObject } from 'react';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import styles from './AvatarSection.module.scss';

type AvatarSectionProps = {
  avatarUrl: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  isAvatarUploadPending: boolean;
  isAvatarDeletePending: boolean;
  selectPhotoText: string;
  onPhotoChange: ChangeEventHandler<HTMLInputElement>;
  onSelectPhotoClick: () => void;
  onDeleteAvatar: () => void;
};

export const AvatarSection = ({
  avatarUrl,
  fileInputRef,
  isAvatarUploadPending,
  isAvatarDeletePending,
  selectPhotoText,
  onPhotoChange,
  onSelectPhotoClick,
  onDeleteAvatar,
}: AvatarSectionProps) => {
  return (
    <div className={styles.avatar_col}>
      <div className={styles.avatar_preview}>
        <div
          className={styles.avatar_placeholder}
          role="img"
          aria-label="Profile avatar"
          style={avatarUrl ? { backgroundImage: `url("${avatarUrl}")` } : undefined}
        >
          {!avatarUrl && <Icon iconId="image-outline" className={styles.avatar_placeholder_icon} />}
        </div>
        {avatarUrl && (
          <button
            type="button"
            className={styles.avatar_delete_button}
            onClick={onDeleteAvatar}
            aria-label="Delete profile photo"
            disabled={isAvatarDeletePending}
          >
            <Icon iconId="avatar-delete-close" width="16" height="16" viewBox="0 0 16 16" />
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        className={styles.avatar_input}
        type="file"
        accept="image/png,image/jpeg"
        onChange={onPhotoChange}
      />
      <Button
        type="button"
        variant="outline"
        className={styles.photo_button}
        onClick={onSelectPhotoClick}
        disabled={isAvatarUploadPending}
      >
        {selectPhotoText}
      </Button>
    </div>
  );
};
