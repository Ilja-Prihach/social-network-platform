'use client';

import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost, updatePost, type PostViewerPost } from '@/entities/post';
import type { ApiError } from '@/shared/api/types';
import { showAlert } from '@/shared/ui/Alert';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';

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

type UpdatePostVariables = {
  postId: string;
  description: string;
};

export function usePostViewerActions({
  post,
  isOwner,
  isFriendPost,
  onClose,
}: UsePostViewerActionsParams) {
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState('');

  const [localDescriptions, setLocalDescriptions] = useState<Record<string, string>>({});

  const currentDescription = post ? (localDescriptions[post.id] ?? post.text ?? '') : '';

  const hasUnsavedChanges = isEditMode && descriptionDraft !== currentDescription;

  const deletePostMutation = useMutation<void, ApiError, string>({
    mutationFn: deletePost,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['home-posts'], refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: ['profile-posts'], refetchType: 'active' }),
      ]);

      showAlert('Post deleted successfully', 'success');
      onClose();
    },
    onError: () => {
      showAlert('Failed to delete post', 'error');
    },
  });

  const updatePostMutation = useMutation<void, ApiError, UpdatePostVariables>({
    mutationFn: ({ postId, description }) => updatePost(postId, { description }),
    onSuccess: async (_, variables) => {
      setLocalDescriptions((prev) => ({
        ...prev,
        [variables.postId]: variables.description,
      }));
      setDescriptionDraft(variables.description);
      setIsEditMode(false);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['home-posts'], refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: ['profile-posts'], refetchType: 'active' }),
      ]);

      showAlert('Post updated successfully', 'success');
    },
    onError: () => {
      showAlert('Failed to update post', 'error');
    },
  });

  const handleDeletePost = useCallback(() => {
    if (!post || deletePostMutation.isPending) return;

    showModal({
      title: 'Delete Post',
      description: 'Are you sure you want to delite this post',
      confirmText: 'yes',
      cancelText: 'no',
      confirmVariant: 'outline',
      cancelVariant: 'primary',
      onConfirm: () => {
        deletePostMutation.mutate(post.id);
      },
    });
  }, [deletePostMutation, post]);

  const handleStartEdit = useCallback(() => {
    if (!post || updatePostMutation.isPending) return;
    setDescriptionDraft(currentDescription);
    setIsEditMode(true);
  }, [currentDescription, post, updatePostMutation.isPending]);

  const handleSaveChanges = useCallback(() => {
    if (!post || updatePostMutation.isPending) return;

    if (descriptionDraft === currentDescription) {
      setIsEditMode(false);
      return;
    }

    updatePostMutation.mutate({
      postId: post.id,
      description: descriptionDraft,
    });
  }, [currentDescription, descriptionDraft, post, updatePostMutation]);

  const handleRequestExitEditMode = useCallback(() => {
    if (!isEditMode) return;

    if (!hasUnsavedChanges) {
      setIsEditMode(false);
      return;
    }

    showModal({
      title: 'Close Post',
      description:
        "Do you really want to close the edition of the publication? If you close changes won't be saved",
      confirmText: 'Yes',
      cancelText: 'No',
      confirmVariant: 'outline',
      cancelVariant: 'primary',
      onConfirm: () => {
        setIsEditMode(false);
      },
    });
  }, [hasUnsavedChanges, isEditMode]);

  const handleRequestClose = useCallback(() => {
    if (!hasUnsavedChanges) {
      setIsEditMode(false);
      onClose();
      return;
    }

    showModal({
      title: 'Close Post',
      description:
        "Do you really want to close the edition of the publication? If you close changes won't be saved",
      confirmText: 'Yes',
      cancelText: 'No',
      confirmVariant: 'outline',
      cancelVariant: 'primary',
      onConfirm: () => {
        setIsEditMode(false);
        onClose();
      },
    });
  }, [hasUnsavedChanges, onClose]);

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
    isActionPending: deletePostMutation.isPending || updatePostMutation.isPending,
    isEditMode,
    descriptionDraft,
    setDescriptionDraft,
    descriptionForView: isEditMode ? descriptionDraft : currentDescription,
    handleSaveChanges,
    handleRequestExitEditMode,
    handleRequestClose,
  };
}
