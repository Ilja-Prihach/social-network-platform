import { useMutation } from '@tanstack/react-query';
import { recoverPassword } from '@/features/auth/forgot-password/api/recoverPassword';

export const useRecoverPassword = () => {
  return useMutation({
    mutationFn: (email: string) => recoverPassword(email),
  });
};
