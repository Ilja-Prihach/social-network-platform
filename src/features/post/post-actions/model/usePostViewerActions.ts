'use client';

import { useCallback, useMemo } from 'react';
import type { PostViewerPost } from '@/entities/post';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';
import { usePostEditMode } from './usePostEditMode';
import { usePostMutations } from './usePostMutations';

export type PostActionMenuItem = {
  id: 'edit' | 'delete' | 'follow' | 'unfollow' | 'copyLink';
  label: string;
  iconId: string;
  onClick?: () => void;
};

type UsePostViewerActionsParams = {
  post: PostViewerPost | null;
  isOwner: boolean;
  isFriendPost: boolean;
  onClose: () => void;
};

function openUnsavedChangesModal(onConfirm: () => void) {
  showModal({
    title: 'Close Post',
    description:
      "Do you really want to close the edition of the publication? If you close changes won't be saved",
    confirmText: 'Yes',
    cancelText: 'No',
    confirmVariant: 'outline',
    cancelVariant: 'primary',
    onConfirm,
  });
}

export function usePostViewerActions({
  post,
  isOwner,
  isFriendPost,
  onClose,
}: UsePostViewerActionsParams) {
  const {
    isEditMode,
    descriptionDraft,
    setDescriptionDraft,
    currentDescription,
    descriptionForView,
    startEdit,
    applySavedDescription,
    exitEditMode,
    handleRequestExitEditMode,
    handleRequestClose,
  } = usePostEditMode({
    post,
    onClose,
    openUnsavedChangesModal,
  });

  const { isActionPending, deletePostById, updatePostById, isDeletePending, isUpdatePending } =
    usePostMutations({
      onDeleteSuccess: onClose,
      onUpdateSuccess: applySavedDescription,
    });

  const handleDeletePost = useCallback(() => {
    if (!post || isDeletePending) return;

    showModal({
      title: 'Delete Post',
      description: 'Are you sure you want to delite this post',
      confirmText: 'yes',
      cancelText: 'no',
      confirmVariant: 'outline',
      cancelVariant: 'primary',
      onConfirm: () => {
        deletePostById(post.id);
      },
    });
  }, [deletePostById, isDeletePending, post]);

  const handleStartEdit = useCallback(() => {
    if (!post || isUpdatePending) return;
    startEdit();
  }, [isUpdatePending, post, startEdit]);

  const handleSaveChanges = useCallback(() => {
    if (!post || isUpdatePending) return;

    if (descriptionDraft === currentDescription) {
      exitEditMode();
      return;
    }

    updatePostById({
      postId: post.id,
      description: descriptionDraft,
    });
  }, [currentDescription, descriptionDraft, exitEditMode, isUpdatePending, post, updatePostById]);

  const menuItems = useMemo<PostActionMenuItem[]>(() => {
    if (isOwner) {
      return [
        { id: 'edit', label: 'Edit Post', iconId: 'edit-2-outline', onClick: handleStartEdit },
        { id: 'delete', label: 'Delete Post', iconId: 'trash-outline', onClick: handleDeletePost },
      ];
    }

    if (isFriendPost) {
      return [
        { id: 'unfollow', label: 'Unfollow', iconId: 'person-remove-outline' },
        { id: 'copyLink', label: 'Copy Link', iconId: 'copy-outline' },
      ];
    }

    return [
      { id: 'follow', label: 'Follow', iconId: 'person-add-outline' },
      { id: 'copyLink', label: 'Copy Link', iconId: 'copy-outline' },
    ];
  }, [handleDeletePost, handleStartEdit, isFriendPost, isOwner]);

  return {
    menuItems,
    isActionPending,
    isEditMode,
    descriptionDraft,
    setDescriptionDraft,
    descriptionForView,
    handleSaveChanges,
    handleRequestExitEditMode,
    handleRequestClose,
  };
}
