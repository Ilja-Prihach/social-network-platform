import { io } from 'socket.io-client';

import { getSocketAccessToken } from '../api/notificationApi.client';
import { createNotificationPollingAdapter } from './pollingAdapter';
import type { NotificationRealtimeAdapter, NotificationRealtimeCallbacks } from './types';

type CreateSocketNotificationAdapterParams = {
  url?: string;
  eventName?: string;
  enablePollingFallback?: boolean;
};

const DEFAULT_SOCKET_URL = 'https://inctagram.work';
const DEFAULT_EVENT_NAME = 'notifications';
const NOTIFICATION_BROADCAST_CHANNEL_NAME = 'notification-realtime-sync';
const NOTIFICATION_INVALIDATE_MESSAGE = 'invalidate';

export const createSocketNotificationAdapter = ({
  url = DEFAULT_SOCKET_URL,
  eventName = DEFAULT_EVENT_NAME,
  enablePollingFallback = true,
}: CreateSocketNotificationAdapterParams = {}): NotificationRealtimeAdapter => {
  return {
    start: (callbacks) => startSocketRealtime({ url, eventName, callbacks, enablePollingFallback }),
  };
};

const startSocketRealtime = ({
  url,
  eventName,
  callbacks,
  enablePollingFallback,
}: {
  url: string;
  eventName: string;
  callbacks: NotificationRealtimeCallbacks;
  enablePollingFallback: boolean;
}) => {
  let socket: ReturnType<typeof io> | null = null;
  let stopPollingFallback: (() => void) | null = null;
  let isStopped = false;
  let isConnected = false;
  const broadcastChannel = createNotificationBroadcastChannel();

  const invalidateNotifications = (shouldBroadcast: boolean) => {
    callbacks.onInvalidate();

    if (shouldBroadcast) {
      broadcastChannel?.postMessage(NOTIFICATION_INVALIDATE_MESSAGE);
    }
  };

  const handleBroadcastMessage = (event: MessageEvent<string>) => {
    if (event.data !== NOTIFICATION_INVALIDATE_MESSAGE) {
      return;
    }

    invalidateNotifications(false);
  };

  broadcastChannel?.addEventListener('message', handleBroadcastMessage);

  const startPollingFallback = () => {
    if (!enablePollingFallback || stopPollingFallback) {
      return;
    }

    stopPollingFallback = createNotificationPollingAdapter().start(callbacks);
  };

  void getSocketAccessToken()
    .then((accessToken) => {
      if (isStopped) return;

      if (!accessToken) {
        startPollingFallback();
        return;
      }

      socket = io(url, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1_500,
        timeout: 10_000,
        autoConnect: false,
        query: {
          accessToken,
        },
      });

      socket.on('connect', () => {
        isConnected = true;
      });

      socket.on('connect_error', (error) => {
        callbacks.onError?.(error);
      });

      socket.on('disconnect', (reason) => {
        isConnected = false;
        callbacks.onError?.(new Error(`Notification socket disconnected: ${reason}`));
      });

      socket.on('error', (error) => {
        callbacks.onError?.(error);
      });

      socket.on(eventName, () => {
        invalidateNotifications(true);
      });

      socket.io.on('error', (error) => {
        callbacks.onError?.(error);

        if (!isConnected) {
          startPollingFallback();
        }
      });

      socket.io.on('reconnect_failed', () => {
        startPollingFallback();
      });

      socket.connect();
    })
    .catch((error) => {
      callbacks.onError?.(error);
      startPollingFallback();
    });

  return () => {
    isStopped = true;
    stopPollingFallback?.();
    socket?.close();
    broadcastChannel?.removeEventListener('message', handleBroadcastMessage);
    broadcastChannel?.close();
  };
};

const createNotificationBroadcastChannel = (): BroadcastChannel | null => {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
    return null;
  }

  return new BroadcastChannel(NOTIFICATION_BROADCAST_CHANNEL_NAME);
};
