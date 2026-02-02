import { useMutation } from '@tanstack/react-query';
import { recoverPassword, type RecoverPasswordPayload } from '@/entities/auth/api/authApi';

export const useRecoverPassword = () => {
  return useMutation({
    mutationFn: (payload: RecoverPasswordPayload) => recoverPassword(payload),
  });
};
