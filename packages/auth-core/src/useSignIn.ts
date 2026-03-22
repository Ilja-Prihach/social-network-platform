'use client';

import { useMutation } from '@tanstack/react-query';
import type { AuthErrorResponse, LoginRequest, LoginResponse } from './authApi';

export type ApiError<T = unknown> = {
  status: number;
  data: T;
};

type SignInMessages = {
  loginSuccess: string;
  profileLoadError: string;
  invalidCredentials: string;
  tooManyRequests: string;
  unknownError: string;
};

type UseSignInDeps = {
  login: (data: LoginRequest) => Promise<LoginResponse>;
  onAuthSuccess: () => Promise<void>;
  onSuccessRedirect: () => void;
  onInvalidate?: () => Promise<void> | void;
  showAlert: (message: string, variant: 'success' | 'error') => void;
  messages: SignInMessages;
};

export const useSignIn = ({
  login,
  onAuthSuccess,
  onSuccessRedirect,
  onInvalidate,
  showAlert,
  messages,
}: UseSignInDeps) =>
  useMutation<LoginResponse, ApiError<AuthErrorResponse>, LoginRequest>({
    mutationFn: login,

    onSuccess: async () => {
      try {
        await onAuthSuccess();
        await onInvalidate?.();
        showAlert(messages.loginSuccess, 'success');
        onSuccessRedirect();
      } catch {
        showAlert(messages.profileLoadError, 'error');
      }
    },

    onError: (error) => {
      const { status, data } = error;

      if (status === 401) {
        showAlert(messages.invalidCredentials, 'error');
        return;
      }

      if (status === 400 && data?.messages) {
        if (typeof data.messages === 'string') {
          showAlert(data.messages, 'error');
          return;
        }

        if (Array.isArray(data.messages) && data.messages.length) {
          showAlert(data.messages[0].message, 'error');
          return;
        }
      }

      if (status === 429) {
        showAlert(messages.tooManyRequests, 'error');
        return;
      }

      showAlert(messages.unknownError, 'error');
    },
  });
