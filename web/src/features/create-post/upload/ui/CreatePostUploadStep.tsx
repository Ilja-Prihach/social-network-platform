import type { CreatePostStyles } from '@/features/create-post/model/uiTypes';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { useDictionary } from 'next-intlayer';
import createPostFlowContent from '@/features/create-post/model/create-post-flow.content';

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
  const dictionary = useDictionary(createPostFlowContent);

  return (
    <div className={styles.upload_step}>
      <div className={styles.upload_preview_box}>
        <Icon iconId="image-outline" width="48" height="48" />
      </div>

      <Button variant="primary" className={styles.upload_button} onClick={onOpenPicker}>
        {isUploading ? dictionary.uploading : dictionary.selectFromComputer}
      </Button>

      <Button
        variant="outline"
        className={styles.upload_button}
        onClick={onOpenDraft}
        disabled={!hasDraft}
      >
        {dictionary.openDraft}
      </Button>
    </div>
  );
}
