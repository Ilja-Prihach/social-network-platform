import clsx from 'clsx';
import type { Step } from '@/features/create-post';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import styles from '../CreatePostFlowWidget.module.scss';

type Props = {
  canGoNext: boolean;
  isPublishing: boolean;
  isUploading: boolean;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
  onPublish: () => void;
  step: Step;
};

export function CreatePostHeader({
  canGoNext,
  isPublishing,
  isUploading,
  onBack,
  onClose,
  onNext,
  onPublish,
  step,
}: Props) {
  if (step === 'upload') {
    return (
      <header className={clsx(styles.header, styles.header_upload)}>
        <h1 className={styles.title}>Add Photo</h1>
        <Button variant="text" className={styles.icon_btn} onClick={onClose} aria-label="Close">
          <Icon iconId="close-outline" />
        </Button>
      </header>
    );
  }

  return (
    <header
      className={clsx(
        styles.header,
        step === 'crop' && styles.header_crop_mobile,
        step === 'filters' && styles.header_filters,
        step === 'publish' && styles.header_publish,
      )}
    >
      <Button variant="text" className={styles.icon_btn} onClick={onBack}>
        <Icon iconId="arrow-ios-back-outline" />
      </Button>

      <h1 className={styles.title}>
        {step === 'crop'
          ? 'Cropping'
          : step === 'filters'
            ? 'Filters'
            : step === 'publish'
              ? 'Publication'
              : 'Create post'}
      </h1>

      {step === 'publish' ? (
        <Button
          variant="text"
          className={styles.action_btn}
          onClick={onPublish}
          disabled={isPublishing || isUploading}
        >
          {isPublishing ? 'Publishing...' : 'Publish'}
        </Button>
      ) : (
        <Button variant="text" className={styles.action_btn} onClick={onNext} disabled={!canGoNext}>
          Next
        </Button>
      )}
    </header>
  );
}
