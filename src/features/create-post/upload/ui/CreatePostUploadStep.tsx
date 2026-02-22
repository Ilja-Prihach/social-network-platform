import type { CreatePostStyles } from '@/features/create-post/model/uiTypes';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';

type Props = {
  hasDraft: boolean;
  isUploading: boolean;
  onOpenDraft: () => void;
  onOpenPicker: () => void;
  styles: CreatePostStyles;
};

export function CreatePostUploadStep({
  hasDraft,
  isUploading,
  onOpenDraft,
  onOpenPicker,
  styles,
}: Props) {
  return (
    <div className={styles.upload_step}>
      <div className={styles.upload_preview_box}>
        <Icon iconId="image-outline" width="48" height="48" />
      </div>

      <Button variant="primary" className={styles.upload_button} onClick={onOpenPicker}>
        {isUploading ? 'Uploading...' : 'Select from Computer'}
      </Button>

      <Button
        variant="outline"
        className={styles.upload_button}
        onClick={onOpenDraft}
        disabled={!hasDraft}
      >
        Open Draft
      </Button>
    </div>
  );
}
