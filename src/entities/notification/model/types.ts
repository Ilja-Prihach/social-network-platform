export type NotificationItem = {
  id: number;
  message: string;
  isRead: boolean;
  notifyAt: string;
  createdAt: string;
};

export type NotificationPage = {
  items: NotificationItem[];
  pageSize: number;
  totalCount: number;
  notReadCount: number;
  nextCursor: number | null;
};

export type GetNotificationsParams = {
  cursor?: number | string | null;
  pageSize?: number | string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  isRead?: boolean | string;
};

export type NotificationRealtimePayload = NotificationItem & {
  clientId?: string;
};
