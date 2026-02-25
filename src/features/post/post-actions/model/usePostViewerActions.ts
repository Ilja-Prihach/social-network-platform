'use client';

import { useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost, type PostViewerPost } from '@/entities/post';
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

export function usePostViewerActions({
  post,
  isOwner,
  isFriendPost,
  onClose,
}: UsePostViewerActionsParams) {
  const queryClient = useQueryClient();

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

  const menuItems = useMemo<PostActionMenuItem[]>(() => {
    if (isOwner) {
      return [
        { id: 'edit', label: 'Edit Post', iconId: 'edit-2-outline' },
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
  }, [handleDeletePost, isFriendPost, isOwner]);

  return {
    menuItems,
    isActionPending: deletePostMutation.isPending,
  };
}
