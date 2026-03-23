'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useDictionary, useLocale } from 'next-intlayer';

import {
  useMarkNotificationsReadMutation,
  useNotificationsInfiniteQuery,
  useNotificationRealtimeSync,
} from '@/entities/notification';
import { Icon } from '@/shared/ui/Icon/Icon';

import headerNotificationsContent from '../../header-notifications.content';
import { HeaderNotificationItem } from './HeaderNotificationItem';
import styles from './HeaderNotifications.module.scss';
import { useNotificationInfiniteScroll } from './useNotificationInfiniteScroll';
import { useNotificationPanelDismiss } from './useNotificationPanelDismiss';
import { useVisibleNotificationsRead } from './useVisibleNotificationsRead';

type HeaderNotificationsProps = {
  userId: number;
};

export const HeaderNotifications = ({ userId }: HeaderNotificationsProps) => {
  const content = useDictionary(headerNotificationsContent);
  const { locale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelBodyRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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

  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  useNotificationPanelDismiss({
    isOpen,
    rootRef,
    onClose: closePanel,
  });

  useNotificationInfiniteScroll({
    enabled: isOpen,
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage,
    loadMoreRef,
    rootRef: panelBodyRef,
    onLoadMore: () => {
      void fetchNextPage();
    },
  });

  useVisibleNotificationsRead({
    enabled: isOpen,
    items,
    rootRef: panelBodyRef,
    onRead: (id, rollback) => {
      markNotificationsReadMutation.mutate([id], {
        onError: rollback,
      });
    },
  });

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

          <div className={styles.panel_body} ref={panelBodyRef}>
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
                <HeaderNotificationItem
                  key={item.id}
                  item={item}
                  itemTitle={labels.itemTitle}
                  newLabel={labels.newLabel}
                  justNow={labels.justNow}
                  locale={locale}
                />
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
