'use client';

import { useEffect, useRef, type RefObject } from 'react';

import type { NotificationItem } from '@/entities/notification';

const READ_DELAY_MS = 3000;
const READ_VISIBILITY_THRESHOLD = 0.75;

type UseVisibleNotificationsReadParams = {
  enabled: boolean;
  items: NotificationItem[];
  rootRef: RefObject<HTMLDivElement | null>;
  onRead: (id: number, rollback: () => void) => void;
};

export const useVisibleNotificationsRead = ({
  enabled,
  items,
  rootRef,
  onRead,
}: UseVisibleNotificationsReadParams) => {
  const requestedReadIdsRef = useRef<Set<number>>(new Set());
  const readTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const readTimeouts = readTimeoutsRef.current;

    if (!enabled) {
      readTimeouts.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      readTimeouts.clear();
      return;
    }

    const root = rootRef.current;
    if (!root) {
      return;
    }

    const unreadItems = items.filter(
      (item) => !item.isRead && !requestedReadIdsRef.current.has(item.id),
    );
    if (!unreadItems.length) {
      return;
    }

    const unreadIds = new Set(unreadItems.map((item) => item.id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idValue = entry.target.getAttribute('data-notification-id');
          const id = Number(idValue);

          if (!id || requestedReadIdsRef.current.has(id) || !unreadIds.has(id)) {
            return;
          }

          if (entry.isIntersecting && entry.intersectionRatio >= READ_VISIBILITY_THRESHOLD) {
            if (readTimeouts.has(id)) {
              return;
            }

            const timeoutId = setTimeout(() => {
              requestedReadIdsRef.current.add(id);
              readTimeouts.delete(id);
              onRead(id, () => {
                requestedReadIdsRef.current.delete(id);
              });
            }, READ_DELAY_MS);

            readTimeouts.set(id, timeoutId);
            return;
          }

          const timeoutId = readTimeouts.get(id);
          if (timeoutId) {
            clearTimeout(timeoutId);
            readTimeouts.delete(id);
          }
        });
      },
      {
        root,
        threshold: [READ_VISIBILITY_THRESHOLD],
      },
    );

    unreadIds.forEach((id) => {
      const element = root.querySelector<HTMLElement>(`[data-notification-id="${id}"]`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
      unreadIds.forEach((id) => {
        const timeoutId = readTimeouts.get(id);
        if (timeoutId) {
          clearTimeout(timeoutId);
          readTimeouts.delete(id);
        }
      });
    };
  }, [enabled, items, onRead, rootRef]);
};
