import clsx from 'clsx';
import { useDictionary } from 'next-intlayer';
import type { Step } from '@/features/create-post';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import createPostFlowContent from '@/features/create-post/model/create-post-flow.content';
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
  const dictionary = useDictionary(createPostFlowContent);

  if (step === 'upload') {
    return (
      <header className={clsx(styles.header, styles.header_upload)}>
        <h1 className={styles.title}>{dictionary.addPhoto}</h1>
        <Button
          variant="text"
          className={styles.icon_btn}
          onClick={onClose}
          aria-label={dictionary.close}
        >
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
      <Button
        variant="text"
        className={styles.icon_btn}
        onClick={onBack}
        aria-label={dictionary.back}
      >
        <Icon iconId="arrow-ios-back-outline" width="24" height="24" />
      </Button>

      <h1 className={styles.title}>
        {step === 'crop'
          ? dictionary.cropping
          : step === 'filters'
            ? dictionary.filters
            : step === 'publish'
              ? dictionary.publication
              : dictionary.createPost}
      </h1>

      {step === 'publish' ? (
        <Button
          variant="text"
          className={styles.action_btn}
          onClick={onPublish}
          disabled={isPublishing || isUploading}
        >
          {isPublishing ? dictionary.publishing : dictionary.publish}
        </Button>
      ) : (
        <Button variant="text" className={styles.action_btn} onClick={onNext} disabled={!canGoNext}>
          {dictionary.next}
        </Button>
      )}
    </header>
  );
}
