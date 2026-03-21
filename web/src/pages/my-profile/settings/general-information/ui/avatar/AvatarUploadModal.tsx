import clsx from 'clsx';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import alertStyles from '@/shared/ui/Alert/Alert.module.scss';
import { useAvatarCrop } from './useAvatarCrop';
import styles from './AvatarUploadModal.module.scss';

type AvatarUploadModalProps = {
  isOpen: boolean;
  title: string;
  saveButtonText: string;
  closeButtonAriaLabel: string;
  previewAriaLabel: string;
  modalPreviewUrl: string | null;
  avatarModalError: string | null;
  isAvatarUploadPending: boolean;
  onCloseAvatarModal: () => void;
  pendingFile: File | null;
  onSaveAvatar: (file?: File) => void;
};

export const AvatarUploadModal = ({
  isOpen,
  title,
  saveButtonText,
  closeButtonAriaLabel,
  previewAriaLabel,
  modalPreviewUrl,
  avatarModalError,
  isAvatarUploadPending,
  onCloseAvatarModal,
  pendingFile,
  onSaveAvatar,
}: AvatarUploadModalProps) => {
  const CROP_SIZE = 316;
  const OUTPUT_SIZE = 512;

  const { offset, scale, onPointerDown, onPointerMove, onPointerUp, buildCroppedFile } =
    useAvatarCrop({
      modalPreviewUrl,
      pendingFile,
      cropSize: CROP_SIZE,
      outputSize: OUTPUT_SIZE,
    });

  const handleSave = async () => {
    if (!pendingFile) {
      onSaveAvatar();
      return;
    }

    const cropped = await buildCroppedFile();
    onSaveAvatar(cropped ?? pendingFile);
  };

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
            aria-label={closeButtonAriaLabel}
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
              aria-label={previewAriaLabel}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              {modalPreviewUrl ? (
                <img
                  src={modalPreviewUrl}
                  alt=""
                  className={styles.avatar_modal_preview_img}
                  style={{
                    transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  }}
                />
              ) : (
                <Icon iconId="image-outline" className={styles.avatar_modal_preview_icon} />
              )}
            </div>
          </div>
        </div>
        <div className={styles.avatar_modal_footer}>
          <Button
            type="button"
            className={styles.avatar_modal_action}
            onClick={handleSave}
            disabled={isAvatarUploadPending}
          >
            {saveButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
