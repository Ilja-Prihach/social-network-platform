import { useMutation } from '@tanstack/react-query';

import { updateProfile } from '@/entities/profile';
import type { UpdateProfileRequest } from '@/entities/profile';
import type { ApiError } from '@/shared/api/types';
import { showAlert } from '@/shared/ui/Alert';
import { getProfileUpdateError, type ProfileUpdateErrorResponse } from './profileUpdateError';

type UseProfileUpdateMutationParams = {
  userId?: number;
  invalidateProfileQueries: (userId?: number) => Promise<void>;
  successMessage: string;
  errorMessage: string;
};

export const useProfileUpdateMutation = ({
  userId,
  invalidateProfileQueries,
  successMessage,
  errorMessage,
}: UseProfileUpdateMutationParams) => {
  return useMutation<void, ApiError<ProfileUpdateErrorResponse>, UpdateProfileRequest>({
    mutationFn: updateProfile,
    onSuccess: async () => {
      showAlert(successMessage, 'success');
      await invalidateProfileQueries(userId);
    },
    onError: (error) => {
      showAlert(getProfileUpdateError(error, errorMessage), 'error');
    },
  });
};
