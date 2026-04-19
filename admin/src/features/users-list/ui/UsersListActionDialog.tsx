'use client';

import { Select } from '@i18n-ui/select';
import {
  BAN_REASON_OPTIONS,
  type BanReasonOption,
  type UsersListDialogState,
} from '../model/useUsersListActions';
import styles from './UsersList.module.scss';

type UsersListActionDialogProps = {
  dialogState: UsersListDialogState;
  banReason: BanReasonOption;
  customBanReason: string;
  actionError: string | null;
  isActionSubmitting: boolean;
  isBanReasonInvalid: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onBanReasonChange: (value: BanReasonOption) => void;
  onCustomBanReasonChange: (value: string) => void;
};

export function UsersListActionDialog({
  dialogState,
  banReason,
  customBanReason,
  actionError,
  isActionSubmitting,
  isBanReasonInvalid,
  onClose,
  onConfirm,
  onBanReasonChange,
  onCustomBanReasonChange,
}: UsersListActionDialogProps) {
  if (!dialogState) {
    return null;
  }

  const title =
    dialogState.type === 'ban'
      ? 'Ban user'
      : dialogState.type === 'unban'
        ? 'Unban user'
        : 'Delete user';

  const description =
    dialogState.type === 'ban'
      ? `Are you sure you want to ban ${dialogState.user.username}?`
      : dialogState.type === 'unban'
        ? `Are you sure you want to unban ${dialogState.user.username}?`
        : `Are you sure you want to delete ${dialogState.user.username}?`;

  return (
    <div className={styles.dialog_overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(event) => event.stopPropagation()}>
        <h2 className={styles.dialog_title}>{title}</h2>
        <p className={styles.dialog_description}>{description}</p>

        {dialogState.type === 'ban' ? (
          <div className={styles.dialog_form}>
            <Select
              className={styles.dialog_select}
              options={BAN_REASON_OPTIONS}
              value={banReason}
              disabled={isActionSubmitting}
              onChange={onBanReasonChange}
            />

            {banReason === 'Another reason' ? (
              <label className={styles.dialog_input}>
                <span>Custom reason</span>
                <input
                  type="text"
                  value={customBanReason}
                  onChange={(event) => onCustomBanReasonChange(event.target.value)}
                  disabled={isActionSubmitting}
                />
              </label>
            ) : null}
          </div>
        ) : null}

        {actionError ? <p className={styles.dialog_error}>{actionError}</p> : null}

        <div className={styles.dialog_actions}>
          <button
            type="button"
            className={styles.dialog_button_secondary}
            onClick={onClose}
            disabled={isActionSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.dialog_button_primary}
            onClick={onConfirm}
            disabled={isActionSubmitting || isBanReasonInvalid}
          >
            {isActionSubmitting ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
