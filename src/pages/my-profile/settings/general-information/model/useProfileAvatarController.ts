import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { deleteProfileAvatar, uploadProfileAvatar } from '@/entities/profile';
import type { ProfileAvatar, UploadProfileAvatarResponse } from '@/entities/profile';
import type { ApiError } from '@/shared/api/types';
import { showAlert } from '@/shared/ui/Alert';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';

type ProfileUpdateErrorResponse = {
  messages?: string | { message: string; field: string }[];
};

type UseProfileAvatarControllerParams = {
  profileAvatars?: ProfileAvatar[];
  userId?: number;
  invalidateProfileQueries: (userId?: number) => Promise<void>;
};

const getProfileUpdateError = (error: ApiError<ProfileUpdateErrorResponse>) => {
  const messages = error.data?.messages;

  if (typeof messages === 'string') return messages;
  if (Array.isArray(messages) && messages.length && messages[0]?.message) {
    return messages[0].message;
  }

  return 'Failed to update profile';
};

const pickProfileAvatar = (avatars?: ProfileAvatar[]) => {
  if (!avatars?.length) return null;
  return avatars.find((avatar) => avatar.width === 192)?.url ?? avatars[0].url ?? null;
};

export const useProfileAvatarController = ({
  profileAvatars,
  userId,
  invalidateProfileQueries,
}: UseProfileAvatarControllerParams) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarModalError, setAvatarModalError] = useState<string | null>(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [localAvatarPreviewUrl, setLocalAvatarPreviewUrl] = useState<string | null>(null);

  const avatarUploadMutation = useMutation<
    UploadProfileAvatarResponse,
    ApiError<ProfileUpdateErrorResponse>,
    File
  >({
    mutationFn: uploadProfileAvatar,
    onSuccess: async () => {
      showAlert('Profile photo updated successfully', 'success');
      await invalidateProfileQueries(userId);
    },
    onError: (error) => {
      showAlert(getProfileUpdateError(error), 'error');
    },
  });

  const deleteAvatarMutation = useMutation<void, ApiError>({
    mutationFn: deleteProfileAvatar,
    onSuccess: async () => {
      showAlert('Profile photo deleted successfully', 'success');
      await invalidateProfileQueries(userId);
    },
    onError: () => {
      showAlert('Failed to delete profile photo', 'error');
    },
  });

  const uploadedAvatars = useMemo(
    () => avatarUploadMutation.data?.avatars ?? profileAvatars,
    [avatarUploadMutation.data?.avatars, profileAvatars],
  );
  const avatarUrl = pickProfileAvatar(uploadedAvatars);
  const modalPreviewUrl = localAvatarPreviewUrl ?? avatarUrl;

  useEffect(() => {
    return () => {
      if (localAvatarPreviewUrl) {
        URL.revokeObjectURL(localAvatarPreviewUrl);
      }
    };
  }, [localAvatarPreviewUrl]);

  const onSelectPhotoClick = () => {
    setAvatarModalError(null);
    fileInputRef.current?.click();
  };

  const onPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = new Set(['image/png', 'image/jpeg']);
    const maxFileSize = 10 * 1024 * 1024;

    if (!allowedTypes.has(file.type)) {
      setAvatarModalError('Error! The format of the uploaded photo must be PNG and JPEG');
      setIsAvatarModalOpen(true);
      event.target.value = '';
      return;
    }

    if (file.size > maxFileSize) {
      setAvatarModalError('Error! Photo size must be less than 10 MB!');
      setIsAvatarModalOpen(true);
      event.target.value = '';
      return;
    }

    setAvatarModalError(null);
    if (localAvatarPreviewUrl) {
      URL.revokeObjectURL(localAvatarPreviewUrl);
    }
    setLocalAvatarPreviewUrl(URL.createObjectURL(file));
    setPendingAvatarFile(file);
    setIsAvatarModalOpen(true);
    event.target.value = '';
  };

  const onCloseAvatarModal = () => {
    setAvatarModalError(null);
    setIsAvatarModalOpen(false);
    setPendingAvatarFile(null);
    if (localAvatarPreviewUrl) {
      URL.revokeObjectURL(localAvatarPreviewUrl);
      setLocalAvatarPreviewUrl(null);
    }
  };

  const onSaveAvatar = () => {
    if (!pendingAvatarFile) {
      fileInputRef.current?.click();
      return;
    }

    avatarUploadMutation.mutate(pendingAvatarFile, {
      onSuccess: () => {
        onCloseAvatarModal();
      },
    });
  };

  const onDeleteAvatar = () => {
    showModal({
      title: 'Delete Profile Photo',
      description: 'Are you sure you want to delete the photo?',
      confirmText: 'Yes',
      cancelText: 'No',
      confirmVariant: 'outline',
      cancelVariant: 'primary',
      onConfirm: () => {
        deleteAvatarMutation.mutate();
      },
    });
  };

  return {
    fileInputRef,
    avatarUrl,
    modalPreviewUrl,
    avatarModalError,
    isAvatarModalOpen,
    isAvatarUploadPending: avatarUploadMutation.isPending,
    isAvatarDeletePending: deleteAvatarMutation.isPending,
    onSelectPhotoClick,
    onPhotoChange,
    onCloseAvatarModal,
    onSaveAvatar,
    onDeleteAvatar,
  };
};
