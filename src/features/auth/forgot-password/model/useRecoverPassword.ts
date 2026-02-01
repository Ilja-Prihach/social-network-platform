import { useMutation } from '@tanstack/react-query';
import {
  recoverPassword,
  type RecoverPasswordPayload,
} from '@/features/auth/forgot-password/api/recoverPassword';

export const useRecoverPassword = () => {
  return useMutation({
    mutationFn: (payload: RecoverPasswordPayload) => recoverPassword(payload),
  });
};
