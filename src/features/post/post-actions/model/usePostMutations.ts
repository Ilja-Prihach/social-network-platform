'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost, updatePost } from '@/entities/post';
import type { ApiError } from '@/shared/api/types';
import { showAlert } from '@/shared/ui/Alert';

type UpdatePostVariables = {
  postId: string;
  description: string;
};

type UsePostMutationsParams = {
  onDeleteSuccess: () => void;
  onUpdateSuccess: (description: string) => void;
  messages: {
    deleteSuccess: string;
    deleteFailed: string;
    updateSuccess: string;
    updateFailed: string;
  };
};

export function usePostMutations({
  onDeleteSuccess,
  onUpdateSuccess,
  messages,
}: UsePostMutationsParams) {
  const queryClient = useQueryClient();

  const invalidatePostLists = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['home-posts'], refetchType: 'active' }),
      queryClient.invalidateQueries({ queryKey: ['profile-posts'], refetchType: 'active' }),
    ]);
  };

  const deletePostMutation = useMutation<void, ApiError, string>({
    mutationFn: deletePost,
    onSuccess: async () => {
      await invalidatePostLists();
      showAlert(messages.deleteSuccess, 'success');
      onDeleteSuccess();
    },
    onError: () => {
      showAlert(messages.deleteFailed, 'error');
    },
  });

  const updatePostMutation = useMutation<void, ApiError, UpdatePostVariables>({
    mutationFn: ({ postId, description }) => updatePost(postId, { description }),
    onSuccess: async (_, variables) => {
      onUpdateSuccess(variables.description);
      await invalidatePostLists();
      showAlert(messages.updateSuccess, 'success');
    },
    onError: () => {
      showAlert(messages.updateFailed, 'error');
    },
  });

  return {
    isActionPending: deletePostMutation.isPending || updatePostMutation.isPending,
    deletePostById: deletePostMutation.mutate,
    updatePostById: updatePostMutation.mutate,
    isDeletePending: deletePostMutation.isPending,
    isUpdatePending: updatePostMutation.isPending,
  };
}
