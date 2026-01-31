'use client';

import { useMutation } from '@tanstack/react-query';
import { AuthErrorResponse, login, LoginRequest, LoginResponse } from '@/entities/auth/api/authApi';

import { showAlert } from '@/shared/ui/Alert';
import { useRouter } from 'next/navigation';
import type { ApiError } from '@/shared/api/types';

export const useSignIn = () => {
  const router = useRouter();

  return useMutation<LoginResponse, ApiError<AuthErrorResponse>, LoginRequest>({
    mutationFn: login,

    onSuccess: () => {
      showAlert('Login successful!', 'success');
      router.replace('/');
    },

    onError: (error) => {
      const { status, data } = error;

      if (status === 401) {
        showAlert('Invalid email or password', 'error');
      } else if (status === 400 && data?.messages) {
        if (typeof data.messages === 'string') {
          showAlert(data.messages, 'error');
        } else if (Array.isArray(data.messages) && data.messages.length) {
          showAlert(data.messages[0].message, 'error');
        }
      } else if (status === 429) {
        showAlert('Too many requests. Please try again later.', 'error');
      } else {
        showAlert('An error occurred. Please try again.', 'error');
      }
    },
  });
};
