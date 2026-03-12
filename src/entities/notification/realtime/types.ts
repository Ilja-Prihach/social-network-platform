export type NotificationRealtimeCallbacks = {
  onInvalidate: () => void;
  onError?: (error: unknown) => void;
};

export type NotificationRealtimeMode = 'socket-with-fallback' | 'socket-only';

export type NotificationRealtimeAdapter = {
  start: (callbacks: NotificationRealtimeCallbacks) => () => void;
};
