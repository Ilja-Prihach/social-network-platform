'use client';

import type { NotificationItem } from '@/entities/notification';
import { formatNotificationRelativeTime } from '@/entities/notification';

import styles from './HeaderNotifications.module.scss';

type HeaderNotificationItemProps = {
  item: NotificationItem;
  itemTitle: string;
  newLabel: string;
  justNow: string;
  locale: string;
};

export const HeaderNotificationItem = ({
  item,
  itemTitle,
  newLabel,
  justNow,
  locale,
}: HeaderNotificationItemProps) => {
  return (
    <article className={styles.notification_item} data-notification-id={item.id}>
      <div className={styles.notification_item_header}>
        <span className={styles.notification_item_title}>{itemTitle}</span>
        {!item.isRead && <span className={styles.notification_item_new}>{newLabel}</span>}
      </div>
      <p className={styles.notification_message}>{item.message}</p>
      <time className={styles.notification_time} dateTime={item.notifyAt}>
        {formatNotificationRelativeTime(item.notifyAt, locale, justNow)}
      </time>
    </article>
  );
};
