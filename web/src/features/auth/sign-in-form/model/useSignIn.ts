'use client';

import { createAuthApi } from '@auth-core/authApi';
import { useSignIn as useSignInCore } from '@auth-core/useSignIn';
import { useQueryClient } from '@tanstack/react-query';
import { showAlert } from '@/shared/ui/Alert';
import { baseApi } from '@/shared/api/baseApi';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/model/store';
import { useMe } from '@/features/auth/model/useMe';
import { useDictionary } from 'next-intlayer';
import signInFormContent from '../sign-in-form.content';

export const useSignIn = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { refetch: refetchMe } = useMe();
  const content = useDictionary(signInFormContent);
  const queryClient = useQueryClient();
  const { login } = createAuthApi(baseApi);

  return useSignInCore({
    login,
    onAuthSuccess: async () => {
      await refetchMe();
      setAuth(true);
    },
    onInvalidate: () =>
      queryClient.invalidateQueries({
        queryKey: ['home-posts'],
        refetchType: 'active',
      }),
    onSuccessRedirect: () => router.replace('/'),
    showAlert,
    messages: {
      loginSuccess: content.loginSuccess.value,
      profileLoadError: content.profileLoadError.value,
      invalidCredentials: content.invalidCredentials.value,
      tooManyRequests: content.tooManyRequests.value,
      unknownError: content.unknownError.value,
    },
  });
};
