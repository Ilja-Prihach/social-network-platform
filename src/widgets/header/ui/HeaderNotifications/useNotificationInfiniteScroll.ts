'use client';

import { useEffect, type RefObject } from 'react';

type UseNotificationInfiniteScrollParams = {
  enabled: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMoreRef: RefObject<HTMLDivElement | null>;
  rootRef: RefObject<HTMLDivElement | null>;
  onLoadMore: () => void;
};

export const useNotificationInfiniteScroll = ({
  enabled,
  hasNextPage,
  isFetchingNextPage,
  loadMoreRef,
  rootRef,
  onLoadMore,
}: UseNotificationInfiniteScrollParams) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const target = loadMoreRef.current;
    const root = rootRef.current;
    if (!target || !root || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || !hasNextPage) {
          return;
        }

        onLoadMore();
      },
      {
        root,
        rootMargin: '120px 0px',
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [enabled, hasNextPage, isFetchingNextPage, loadMoreRef, onLoadMore, rootRef]);
};
