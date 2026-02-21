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
  texts: {
    uploadSuccess: string;
    deleteSuccess: string;
    deleteFailed: string;
    uploadFormatError: string;
    uploadSizeError: string;
    deleteModalTitle: string;
    deleteModalDescription: string;
    deleteModalYes: string;
    deleteModalNo: string;
  };
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
  texts,
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
      showAlert(texts.uploadSuccess, 'success');
      await invalidateProfileQueries(userId);
    },
    onError: (error) => {
      showAlert(getProfileUpdateError(error), 'error');
    },
  });

  const deleteAvatarMutation = useMutation<void, ApiError>({
    mutationFn: deleteProfileAvatar,
    onSuccess: async () => {
      showAlert(texts.deleteSuccess, 'success');
      await invalidateProfileQueries(userId);
    },
    onError: () => {
      showAlert(texts.deleteFailed, 'error');
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
      setAvatarModalError(texts.uploadFormatError);
      setIsAvatarModalOpen(true);
      event.target.value = '';
      return;
    }

    if (file.size > maxFileSize) {
      setAvatarModalError(texts.uploadSizeError);
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
      title: texts.deleteModalTitle,
      description: texts.deleteModalDescription,
      confirmText: texts.deleteModalYes,
      cancelText: texts.deleteModalNo,
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
