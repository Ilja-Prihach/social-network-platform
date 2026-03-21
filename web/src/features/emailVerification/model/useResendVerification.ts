import { useMutation } from '@tanstack/react-query';
import { resendVerification } from '@/features/emailVerification/api/resendVerification';

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (email: string) => resendVerification(email),
  });
};
