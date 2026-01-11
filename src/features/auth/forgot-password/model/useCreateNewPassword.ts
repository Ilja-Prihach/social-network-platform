import { useMutation } from '@tanstack/react-query';
import { createNewPassword } from '@/features/auth/forgot-password/api/createNewPassword';

type NewPasswordPayload = {
  newPassword: string;
  recoveryCode: string;
};

export const useCreateNewPassword = () => {
  return useMutation({
    mutationFn: (payload: NewPasswordPayload) => createNewPassword(payload),
  });
};
