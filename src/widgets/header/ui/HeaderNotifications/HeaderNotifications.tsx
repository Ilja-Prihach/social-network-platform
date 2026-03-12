'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDictionary, useLocale } from 'next-intlayer';

import {
  formatNotificationRelativeTime,
  useMarkNotificationsReadMutation,
  useNotificationsInfiniteQuery,
  useNotificationRealtimeSync,
} from '@/entities/notification';
import { Icon } from '@/shared/ui/Icon/Icon';

import headerNotificationsContent from '../../header-notifications.content';
import styles from './HeaderNotifications.module.scss';

type HeaderNotificationsProps = {
  userId: number;
};

export const HeaderNotifications = ({ userId }: HeaderNotificationsProps) => {
  const content = useDictionary(headerNotificationsContent);
  const { locale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const requestedReadIdsRef = useRef<Set<number>>(new Set());

  const notificationsQuery = useNotificationsInfiniteQuery(userId, true);
  const markNotificationsReadMutation = useMarkNotificationsReadMutation(userId);
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = notificationsQuery;

  useNotificationRealtimeSync({
    enabled: true,
    userId,
  });

  const items = useMemo(
    () => notificationsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [notificationsQuery.data],
  );
  const unreadCount = notificationsQuery.data?.pages[0]?.notReadCount ?? 0;
  const labels = {
    title: toText(content.title),
    itemTitle: toText(content.itemTitle),
    newLabel: toText(content.newLabel),
    emptyState: toText(content.emptyState),
    loadError: toText(content.loadError),
    openAriaLabel: toText(content.openAriaLabel),
    justNow: toText(content.justNow),
  };

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const target = loadMoreRef.current;
    if (!target || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || !hasNextPage) {
          return;
        }

        void fetchNextPage();
      },
      {
        root: target.parentElement,
        rootMargin: '120px 0px',
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [isOpen, fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const unreadIds = items
      .filter((item) => !item.isRead && !requestedReadIdsRef.current.has(item.id))
      .map((item) => item.id);

    if (!unreadIds.length) {
      return;
    }

    unreadIds.forEach((id) => requestedReadIdsRef.current.add(id));

    markNotificationsReadMutation.mutate(unreadIds, {
      onError: () => {
        unreadIds.forEach((id) => requestedReadIdsRef.current.delete(id));
      },
    });
  }, [isOpen, items, markNotificationsReadMutation]);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger_button}
        aria-label={labels.openAriaLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={toggleOpen}
      >
        <Icon iconId="Outline bell" />
        {unreadCount > 0 && (
          <span className={styles.counter_badge}>{formatCount(unreadCount)}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.panel} role="dialog" aria-label={labels.title}>
          <div className={styles.panel_header}>
            <h2 className={styles.panel_title}>{labels.title}</h2>
          </div>

          <div className={styles.panel_body}>
            {notificationsQuery.isLoading && (
              <div className={styles.loading_state}>{labels.title}...</div>
            )}

            {notificationsQuery.isError && (
              <div className={styles.error_state}>{labels.loadError}</div>
            )}

            {!notificationsQuery.isLoading && !notificationsQuery.isError && items.length === 0 && (
              <div className={styles.empty_state}>{labels.emptyState}</div>
            )}

            {!notificationsQuery.isLoading &&
              !notificationsQuery.isError &&
              items.map((item) => (
                <article key={item.id} className={styles.notification_item}>
                  <div className={styles.notification_item_header}>
                    <span className={styles.notification_item_title}>{labels.itemTitle}</span>
                    {!item.isRead && (
                      <span className={styles.notification_item_new}>{labels.newLabel}</span>
                    )}
                  </div>
                  <p className={styles.notification_message}>{item.message}</p>
                  <time className={styles.notification_time} dateTime={item.notifyAt}>
                    {formatNotificationRelativeTime(item.notifyAt, locale, labels.justNow)}
                  </time>
                </article>
              ))}

            {isFetchingNextPage && <div className={styles.loading_more}>{labels.title}...</div>}

            <div ref={loadMoreRef} className={styles.load_more_trigger} aria-hidden />
          </div>
        </div>
      )}
    </div>
  );
};

type DictionaryText = string | { value: string };
const toText = (value: DictionaryText): string => (typeof value === 'string' ? value : value.value);

const formatCount = (value: number) => {
  if (value > 99) {
    return '99+';
  }

  return String(value);
};
