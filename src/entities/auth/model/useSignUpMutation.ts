import { useMutation } from '@tanstack/react-query';
import { signUp } from '@/entities/auth/api/authApi';
import type { ApiError } from '@/shared/api/types';

export function useSignUpMutation() {
  return useMutation({
    mutationKey: ['auth', 'registration'],
    mutationFn: signUp,
  });
}
