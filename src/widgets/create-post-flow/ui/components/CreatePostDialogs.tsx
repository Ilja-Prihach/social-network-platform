import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import styles from '../CreatePostFlowWidget.module.scss';

type Props = {
  onCloseConfirm: () => void;
  onCloseValidation: () => void;
  onSaveDraft: () => void;
  showCloseConfirm: boolean;
  validationMessage: string | null;
};

export function CreatePostDialogs({
  onCloseConfirm,
  onCloseValidation,
  onSaveDraft,
  showCloseConfirm,
  validationMessage,
}: Props) {
  return (
    <>
      {showCloseConfirm && (
        <div className={styles.dialog_overlay}>
          <div className={styles.dialog}>
            <div className={styles.dialog_header}>
              <h2>Close publication creation?</h2>
              <Button variant="text" className={styles.icon_btn} onClick={onCloseConfirm}>
                <Icon iconId="close-outline" />
              </Button>
            </div>

            <p>
              Do you really want to close the creation of a publication? If you close everything
              will be deleted
            </p>

            <div className={styles.dialog_actions}>
              <Button variant="outline" onClick={onSaveDraft}>
                Save draft
              </Button>
              <Button variant="primary" onClick={onCloseConfirm}>
                Discard
              </Button>
            </div>
          </div>
        </div>
      )}

      {validationMessage && (
        <div className={styles.dialog_overlay}>
          <div className={styles.dialog}>
            <div className={styles.dialog_header}>
              <h2>Invalid photo</h2>
              <Button variant="text" className={styles.icon_btn} onClick={onCloseValidation}>
                <Icon iconId="close-outline" />
              </Button>
            </div>

            <p>{validationMessage}</p>

            <div className={styles.dialog_actions}>
              <Button variant="primary" onClick={onCloseValidation}>
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
