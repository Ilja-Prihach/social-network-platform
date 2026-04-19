'use client';

import { useState } from 'react';
import type { AdminCredentials } from '@/shared/apollo';
import { getAdminCredentials } from '@/shared/lib/adminAuthStorage';
import type { UserRow } from '../lib/mapUserToRow';
import { banUser, removeUser, unbanUser } from './userActions';

export type BanReasonOption = 'Bad behavior' | 'Advertising placement' | 'Another reason';
export type UsersListDialogState =
  | { type: 'ban'; user: UserRow }
  | { type: 'unban'; user: UserRow }
  | { type: 'delete'; user: UserRow }
  | null;

export const BAN_REASON_OPTIONS: Array<{ title: BanReasonOption; value: BanReasonOption }> = [
  { title: 'Bad behavior', value: 'Bad behavior' },
  { title: 'Advertising placement', value: 'Advertising placement' },
  { title: 'Another reason', value: 'Another reason' },
];

const resolveBanReason = (reason: BanReasonOption, customReason: string) => {
  if (reason !== 'Another reason') {
    return reason;
  }

  return customReason.trim();
};

type UseUsersListActionsParams = {
  onOpenUserDetails: (userId: number) => void;
  onUsersChanged: (credentials?: AdminCredentials | null) => Promise<void>;
};

export const useUsersListActions = ({
  onOpenUserDetails,
  onUsersChanged,
}: UseUsersListActionsParams) => {
  const [activeMenuUserId, setActiveMenuUserId] = useState<number | null>(null);
  const [dialogState, setDialogState] = useState<UsersListDialogState>(null);
  const [banReason, setBanReason] = useState<BanReasonOption>('Bad behavior');
  const [customBanReason, setCustomBanReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  const currentBanReason = resolveBanReason(banReason, customBanReason);
  const isBanReasonInvalid = banReason === 'Another reason' && currentBanReason.trim() === '';

  const resetDialogState = () => {
    setActionError(null);
    setDialogState(null);
    setBanReason('Bad behavior');
    setCustomBanReason('');
  };

  const openDialog = (dialog: Exclude<UsersListDialogState, null>) => {
    setActionError(null);
    setActiveMenuUserId(null);
    setDialogState(dialog);
    setBanReason('Bad behavior');
    setCustomBanReason('');
  };

  const closeDialog = () => {
    if (isActionSubmitting) {
      return;
    }

    resetDialogState();
  };

  const handleMenuToggle = (userId: number) => {
    setActiveMenuUserId((value) => (value === userId ? null : userId));
  };

  const handleOpenUserDetails = (userId: number) => {
    setActiveMenuUserId(null);
    onOpenUserDetails(userId);
  };

  const handleConfirmAction = async () => {
    if (!dialogState) {
      return;
    }

    const credentials = getAdminCredentials();

    if (!credentials) {
      setActionError('Admin credentials not found');
      return;
    }

    try {
      setIsActionSubmitting(true);
      setActionError(null);

      if (dialogState.type === 'ban') {
        if (isBanReasonInvalid) {
          setActionError('Please provide a reason');
          return;
        }

        await banUser(credentials, {
          userId: dialogState.user.id,
          banReason: currentBanReason,
        });
      }

      if (dialogState.type === 'unban') {
        await unbanUser(credentials, { userId: dialogState.user.id });
      }

      if (dialogState.type === 'delete') {
        await removeUser(credentials, { userId: dialogState.user.id });
      }

      await onUsersChanged(credentials);
      resetDialogState();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setIsActionSubmitting(false);
    }
  };

  return {
    activeMenuUserId,
    dialogState,
    banReason,
    customBanReason,
    actionError,
    isActionSubmitting,
    isBanReasonInvalid,
    handleConfirmAction,
    handleMenuToggle,
    handleOpenUserDetails,
    openDialog,
    closeDialog,
    setBanReason,
    setCustomBanReason,
  };
};
