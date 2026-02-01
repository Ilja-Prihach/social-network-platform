import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/entities/auth/api/authApi';
import { useLocale } from 'next-intlayer';

export const useSignOut = () => {
  const router = useRouter();
  const { locale } = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  const signOut = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await logout();
    } catch {
      // Ignore server errors; client cleanup still required.
    } finally {
      router.push(`/${locale}/sign-in`);
      setIsLoading(false);
    }
  };

  return { signOut, isLoading };
};
