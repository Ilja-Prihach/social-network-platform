'use client';

import { useMutation } from '@tanstack/react-query';
import { login, LoginRequest } from '@/entities/auth/api/authApi';
import { showAlert } from '@/shared/ui/Alert';
import { useRouter } from 'next/navigation';
import { saveToken } from '@/entities/auth/model/tokenStorage';

export const useSignIn = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      saveToken(data.accessToken);
      showAlert('Login successful!', 'success');
      router.replace('/');
    },
    onError: (error: unknown) => {
      const status = error.status;
      const data = error.data;

      if (status === 401) {
        showAlert('Invalid email or password', 'error');
      } else if (status === 400 && data?.messages) {
        showAlert(data.messages[0]?.message || 'Bad request', 'error');
      } else if (status === 429) {
        showAlert('Too many requests. Please try again later.', 'error');
      } else {
        showAlert('An error occurred. Please try again.', 'error');
      }
    },
  });
};
