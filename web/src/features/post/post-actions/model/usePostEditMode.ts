'use client';

import { useCallback, useState } from 'react';
import type { PostViewerPost } from '@/entities/post';

type UsePostEditModeParams = {
  post: PostViewerPost | null;
  onClose: () => void;
  openUnsavedChangesModal: (onConfirm: () => void) => void;
};

export function usePostEditMode({ post, onClose, openUnsavedChangesModal }: UsePostEditModeParams) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState('');
  const [savedDescriptionState, setSavedDescriptionState] = useState<{
    postId: string;
    description: string;
  } | null>(null);

  const currentDescription =
    post && savedDescriptionState?.postId === post.id
      ? savedDescriptionState.description
      : (post?.text ?? '');

  const hasUnsavedChanges = isEditMode && descriptionDraft !== currentDescription;

  const startEdit = useCallback(() => {
    if (!post) return;
    setDescriptionDraft(currentDescription);
    setIsEditMode(true);
  }, [currentDescription, post]);

  const applySavedDescription = useCallback(
    (description: string) => {
      if (!post) return;
      setSavedDescriptionState({ postId: post.id, description });
      setDescriptionDraft(description);
      setIsEditMode(false);
    },
    [post],
  );

  const exitEditMode = useCallback(() => {
    setIsEditMode(false);
  }, []);

  const handleRequestExitEditMode = useCallback(() => {
    if (!isEditMode) return;

    if (!hasUnsavedChanges) {
      setIsEditMode(false);
      return;
    }

    openUnsavedChangesModal(() => {
      setIsEditMode(false);
    });
  }, [hasUnsavedChanges, isEditMode, openUnsavedChangesModal]);

  const handleRequestClose = useCallback(() => {
    if (!hasUnsavedChanges) {
      setIsEditMode(false);
      onClose();
      return;
    }

    openUnsavedChangesModal(() => {
      setIsEditMode(false);
      onClose();
    });
  }, [hasUnsavedChanges, onClose, openUnsavedChangesModal]);

  return {
    isEditMode,
    descriptionDraft,
    setDescriptionDraft,
    currentDescription,
    descriptionForView: isEditMode ? descriptionDraft : currentDescription,
    hasUnsavedChanges,
    startEdit,
    applySavedDescription,
    exitEditMode,
    handleRequestExitEditMode,
    handleRequestClose,
  };
}
