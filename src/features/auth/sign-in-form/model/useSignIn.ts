'use client';

import { useMutation } from '@tanstack/react-query';
import { login, LoginRequest } from '@/entities/auth/api/authApi';
import { showAlert } from '@/shared/ui/Alert';
import { useRouter } from 'next/navigation';

export const useSignIn = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      showAlert('Login successful!', 'success');
      router.push('/');
    },
    onError: (error: unknown) => {
      const status = error.status;
      const data = error.data;

      if (status === 401) {
        showAlert('Invalid email or password', 'error');
      } else if (status === 400 && data?.messages) {
        // Validation errors are handled by React Hook Form in the component
        // but we can also show a general alert
        showAlert(data.messages[0]?.message || 'Bad request', 'error');
      } else if (status === 429) {
        showAlert('Too many requests. Please try again later.', 'error');
      } else {
        showAlert('An error occurred. Please try again.', 'error');
      }
    },
  });
};
