import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { useDictionary } from 'next-intlayer';
import createPostFlowContent from '../../create-post-flow.content';
import styles from '../CreatePostFlowWidget.module.scss';

type Props = {
  onContinueEditing: () => void;
  onDiscardChanges: () => void;
  onCloseValidation: () => void;
  onSaveDraft: () => void;
  showCloseConfirm: boolean;
  validationMessage: string | null;
};

export function CreatePostDialogs({
  onContinueEditing,
  onDiscardChanges,
  onCloseValidation,
  onSaveDraft,
  showCloseConfirm,
  validationMessage,
}: Props) {
  const dictionary = useDictionary(createPostFlowContent);

  return (
    <>
      {showCloseConfirm && (
        <div className={styles.dialog_overlay}>
          <div className={styles.dialog}>
            <div className={styles.dialog_header}>
              <h2>{dictionary.closePublicationTitle}</h2>
              <Button
                variant="text"
                className={styles.icon_btn}
                onClick={onContinueEditing}
                aria-label={dictionary.close}
              >
                <Icon iconId="close-outline" />
              </Button>
            </div>

            <p>{dictionary.closePublicationDescription}</p>

            <div className={styles.dialog_actions}>
              <Button variant="outline" onClick={onSaveDraft}>
                {dictionary.saveDraft}
              </Button>
              <Button variant="outline" onClick={onContinueEditing}>
                {dictionary.continueEditing}
              </Button>
              <Button variant="primary" onClick={onDiscardChanges}>
                {dictionary.discard}
              </Button>
            </div>
          </div>
        </div>
      )}

      {validationMessage && (
        <div className={styles.dialog_overlay}>
          <div className={styles.dialog}>
            <div className={styles.dialog_header}>
              <h2>{dictionary.validationErrorTitle}</h2>
              <Button
                variant="text"
                className={styles.icon_btn}
                onClick={onCloseValidation}
                aria-label={dictionary.close}
              >
                <Icon iconId="close-outline" />
              </Button>
            </div>

            <p>{validationMessage}</p>

            <div className={styles.dialog_actions}>
              <Button variant="primary" onClick={onCloseValidation}>
                {dictionary.ok}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
