import clsx from 'clsx';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import alertStyles from '@/shared/ui/Alert/Alert.module.scss';
import styles from './AvatarUploadModal.module.scss';

type AvatarUploadModalProps = {
  isOpen: boolean;
  title: string;
  saveButtonText: string;
  modalPreviewUrl: string | null;
  avatarModalError: string | null;
  isAvatarUploadPending: boolean;
  onCloseAvatarModal: () => void;
  onSaveAvatar: () => void;
};

export const AvatarUploadModal = ({
  isOpen,
  title,
  saveButtonText,
  modalPreviewUrl,
  avatarModalError,
  isAvatarUploadPending,
  onCloseAvatarModal,
  onSaveAvatar,
}: AvatarUploadModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.avatar_modal_overlay} onClick={onCloseAvatarModal}>
      <div className={styles.avatar_modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.avatar_modal_header}>
          <h2 className={styles.avatar_modal_title}>{title}</h2>
          <button
            type="button"
            className={styles.avatar_modal_close}
            onClick={onCloseAvatarModal}
            aria-label="Close"
          >
            <Icon iconId="close-outline" />
          </button>
        </div>
        <div className={styles.avatar_modal_divider} />
        {avatarModalError && (
          <div className={styles.avatar_modal_error_container}>
            <div className={clsx(alertStyles.alert, alertStyles.error, styles.avatar_modal_error)}>
              {avatarModalError}
            </div>
          </div>
        )}
        <div className={styles.avatar_modal_preview}>
          <div
            className={styles.avatar_modal_preview_stage}
            style={modalPreviewUrl ? { backgroundImage: `url("${modalPreviewUrl}")` } : undefined}
          >
            {modalPreviewUrl && <div className={styles.avatar_modal_preview_blur} />}
            <div
              className={styles.avatar_modal_preview_image}
              role="img"
              aria-label="Avatar preview"
              style={modalPreviewUrl ? { backgroundImage: `url("${modalPreviewUrl}")` } : undefined}
            >
              {!modalPreviewUrl && (
                <Icon iconId="image-outline" className={styles.avatar_modal_preview_icon} />
              )}
            </div>
          </div>
        </div>
        <Button
          type="button"
          className={styles.avatar_modal_action}
          onClick={onSaveAvatar}
          disabled={isAvatarUploadPending}
        >
          {saveButtonText}
        </Button>
      </div>
    </div>
  );
};
