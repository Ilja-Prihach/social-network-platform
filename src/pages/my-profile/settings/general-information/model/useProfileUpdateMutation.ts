import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/entities/profile';
import type { UpdateProfileRequest } from '@/entities/profile';
import type { ApiError } from '@/shared/api/types';
import { showAlert } from '@/shared/ui/Alert';
import { getProfileUpdateError, type ProfileUpdateErrorResponse } from './profileUpdateError';

type UseProfileUpdateMutationParams = {
  userId?: number;
  invalidateProfileQueries: (userId?: number) => Promise<void>;
};

export const useProfileUpdateMutation = ({
  userId,
  invalidateProfileQueries,
}: UseProfileUpdateMutationParams) => {
  const router = useRouter();

  return useMutation<void, ApiError<ProfileUpdateErrorResponse>, UpdateProfileRequest>({
    mutationFn: updateProfile,
    onSuccess: async () => {
      showAlert('Profile updated successfully', 'success');

      await invalidateProfileQueries(userId);

      if (userId) {
        router.replace(`/profile/${userId}`);
        return;
      }

      router.replace('/my-profile');
    },
    onError: (error) => {
      showAlert(getProfileUpdateError(error), 'error');
    },
  });
};
