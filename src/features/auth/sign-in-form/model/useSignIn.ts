'use client';

import { useMutation } from '@tanstack/react-query';
import { AuthErrorResponse, login, LoginRequest, LoginResponse } from '@/entities/auth/api/authApi';

import { showAlert } from '@/shared/ui/Alert';
import { useRouter } from 'next/navigation';
import type { ApiError } from '@/shared/api/types';
import { useAuthStore } from '@/features/auth/model/store';
import { useMe } from '@/features/auth/model/useMe';
import { useDictionary } from 'next-intlayer';
import signInFormContent from '../sign-in-form.content';
import { useQueryClient } from '@tanstack/react-query';

export const useSignIn = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { refetch: refetchMe } = useMe();
  const content = useDictionary(signInFormContent);
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, ApiError<AuthErrorResponse>, LoginRequest>({
    mutationFn: login,

    onSuccess: async () => {
      try {
        await refetchMe();
        await queryClient.invalidateQueries({
          queryKey: ['home-posts'],
          refetchType: 'active',
        });
        setAuth(true);
        showAlert(content.loginSuccess.value, 'success');
        router.replace('/');
      } catch {
        showAlert(content.profileLoadError.value, 'error');
      }
    },

    onError: (error) => {
      const { status, data } = error;

      if (status === 401) {
        showAlert(content.invalidCredentials.value, 'error');
      } else if (status === 400 && data?.messages) {
        if (typeof data.messages === 'string') {
          showAlert(data.messages, 'error');
        } else if (Array.isArray(data.messages) && data.messages.length) {
          showAlert(data.messages[0].message, 'error');
        }
      } else if (status === 429) {
        showAlert(content.tooManyRequests.value, 'error');
      } else {
        showAlert(content.unknownError.value, 'error');
      }
    },
  });
};
