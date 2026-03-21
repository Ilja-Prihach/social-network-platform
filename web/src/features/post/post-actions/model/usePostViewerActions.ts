'use client';

import { useCallback, useMemo } from 'react';
import { useDictionary } from 'next-intlayer';
import type { PostViewerPost } from '@/entities/post';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';
import { usePostEditMode } from './usePostEditMode';
import { usePostMutations } from './usePostMutations';
import postActionsContent from './post-actions.content';

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

export function usePostViewerActions({
  post,
  isOwner,
  isFriendPost,
  onClose,
}: UsePostViewerActionsParams) {
  const dictionary = useDictionary(postActionsContent);

  const openUnsavedChangesModal = useCallback(
    (onConfirm: () => void) => {
      showModal({
        title: dictionary.closePostTitle.value,
        description: dictionary.closePostDescription.value,
        confirmText: dictionary.confirmYes.value,
        cancelText: dictionary.confirmNo.value,
        confirmVariant: 'outline',
        cancelVariant: 'primary',
        onConfirm,
      });
    },
    [dictionary],
  );

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
      messages: {
        deleteSuccess: dictionary.deleteSuccess.value,
        deleteFailed: dictionary.deleteFailed.value,
        updateSuccess: dictionary.updateSuccess.value,
        updateFailed: dictionary.updateFailed.value,
      },
    });

  const handleDeletePost = useCallback(() => {
    if (!post || isDeletePending) return;

    showModal({
      title: dictionary.deletePostTitle.value,
      description: dictionary.deletePostDescription.value,
      confirmText: dictionary.confirmYes.value,
      cancelText: dictionary.confirmNo.value,
      confirmVariant: 'outline',
      cancelVariant: 'primary',
      onConfirm: () => {
        deletePostById(post.id);
      },
    });
  }, [deletePostById, dictionary, isDeletePending, post]);

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
        {
          id: 'edit',
          label: dictionary.editPost.value,
          iconId: 'edit-2-outline',
          onClick: handleStartEdit,
        },
        {
          id: 'delete',
          label: dictionary.removePost.value,
          iconId: 'trash-outline',
          onClick: handleDeletePost,
        },
      ];
    }

    if (isFriendPost) {
      return [
        { id: 'unfollow', label: dictionary.unfollow.value, iconId: 'person-remove-outline' },
        { id: 'copyLink', label: dictionary.copyLink.value, iconId: 'copy-outline' },
      ];
    }

    return [
      { id: 'follow', label: dictionary.follow.value, iconId: 'person-add-outline' },
      { id: 'copyLink', label: dictionary.copyLink.value, iconId: 'copy-outline' },
    ];
  }, [dictionary, handleDeletePost, handleStartEdit, isFriendPost, isOwner]);

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
