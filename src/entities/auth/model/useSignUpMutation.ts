import { useMutation } from '@tanstack/react-query';
import { signUp } from '@/entities/auth/api/authApi';

export function useSignUpMutation() {
  return useMutation({
    mutationKey: ['auth', 'registration'],
    mutationFn: signUp,
  });
}
