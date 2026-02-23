'use client';

import { useCallback, useMemo, useState } from 'react';
import type { PostViewerPost } from '@/entities/post';

type UsePostViewerParams<TItem> = {
  items: TItem[];
  currentUserId?: number;
  getId: (item: TItem) => string;
  mapToPost: (item: TItem) => PostViewerPost;
  getAuthorId?: (item: TItem) => number | null | undefined;
  getIsFriendPost?: (item: TItem) => boolean;
};

export function usePostViewer<TItem>({
  items,
  currentUserId,
  getId,
  mapToPost,
  getAuthorId,
  getIsFriendPost,
}: UsePostViewerParams<TItem>) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const selectedItem = useMemo(() => {
    if (!selectedPostId) return null;
    return items.find((item) => getId(item) === selectedPostId) ?? null;
  }, [getId, items, selectedPostId]);

  const selectedPost = useMemo(
    () => (selectedItem ? mapToPost(selectedItem) : null),
    [mapToPost, selectedItem],
  );

  const isOwner = useMemo(() => {
    if (!selectedItem || !getAuthorId || typeof currentUserId !== 'number') {
      return false;
    }

    const authorId = getAuthorId(selectedItem);
    if (typeof authorId !== 'number' || Number.isNaN(authorId)) {
      return false;
    }

    return authorId === currentUserId;
  }, [currentUserId, getAuthorId, selectedItem]);

  const isFriendPost = useMemo(() => {
    if (!selectedItem || !getIsFriendPost) return false;
    return Boolean(getIsFriendPost(selectedItem));
  }, [getIsFriendPost, selectedItem]);

  const openPost = useCallback((id: string) => {
    setSelectedPostId(id);
  }, []);

  const closePost = useCallback(() => {
    setSelectedPostId(null);
  }, []);

  return {
    selectedPost,
    isOwner,
    isFriendPost,
    openPost,
    closePost,
  };
}
