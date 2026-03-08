import clsx from 'clsx';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import alertStyles from '@/shared/ui/Alert/Alert.module.scss';
import styles from './AvatarUploadModal.module.scss';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

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

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  useEffect(() => {
    if (!modalPreviewUrl) return;

    const img = new Image();
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      setOffset({ x: 0, y: 0 });
    };
    img.src = modalPreviewUrl;
  }, [modalPreviewUrl]);

  const scale = useMemo(() => {
    if (!naturalSize.width || !naturalSize.height) return 1;
    return Math.max(CROP_SIZE / naturalSize.width, CROP_SIZE / naturalSize.height);
  }, [naturalSize]);

  const clampOffset = (x: number, y: number) => {
    const maxX = Math.max(0, (naturalSize.width * scale - CROP_SIZE) / 2);
    const maxY = Math.max(0, (naturalSize.height * scale - CROP_SIZE) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!modalPreviewUrl) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    setOffset(clampOffset(dragRef.current.originX + dx, dragRef.current.originY + dy));
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };

  const buildCroppedFile = async () => {
    if (!pendingFile || !modalPreviewUrl || !naturalSize.width || !naturalSize.height || !scale) {
      return null;
    }

    const img = new Image();
    img.src = modalPreviewUrl;
    await img.decode();

    const cropSize = CROP_SIZE / scale;
    const cropX = (-CROP_SIZE / 2 - offset.x) / scale + naturalSize.width / 2;
    const cropY = (-CROP_SIZE / 2 - offset.y) / scale + naturalSize.height / 2;

    const outputSize = 512;
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, outputSize, outputSize);

    const mime = pendingFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), mime, 0.92),
    );

    if (!blob) return null;
    return new File([blob], pendingFile.name, { type: mime });
  };

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
  );
};
