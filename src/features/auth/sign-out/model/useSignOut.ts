import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/entities/auth/api/authApi';
import { useLocale } from 'next-intlayer';
import { useQueryClient } from '@tanstack/react-query';

export const useSignOut = () => {
  const router = useRouter();
  const { locale } = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const signOut = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await logout();
    } catch {
      // Ignore server errors; client cleanup still required.
    } finally {
      queryClient.setQueryData(['me'], null);
      await queryClient.invalidateQueries({
        queryKey: ['home-posts'],
        refetchType: 'active',
      });
      router.replace(`/${locale}/`);
      setIsLoading(false);
    }
  };

  return { signOut, isLoading };
};
