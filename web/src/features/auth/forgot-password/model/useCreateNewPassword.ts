import { useMutation } from '@tanstack/react-query';
import { createNewPassword } from '@/entities/auth/api/authApi';

type NewPasswordPayload = {
  newPassword: string;
  recoveryCode: string;
};

export const useCreateNewPassword = () => {
  return useMutation({
    mutationFn: (payload: NewPasswordPayload) => createNewPassword(payload),
  });
};
