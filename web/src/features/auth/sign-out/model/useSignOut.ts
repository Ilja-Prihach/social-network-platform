import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/entities/auth/api/authApi';
import { useLocale } from 'next-intlayer';
import { useQueryClient } from '@tanstack/react-query';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';

type SignOutConfirmTexts = {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
};

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

  const confirmSignOut = ({ title, description, confirmText, cancelText }: SignOutConfirmTexts) => {
    if (isLoading) return;

    showModal({
      title,
      description,
      confirmText,
      cancelText,
      confirmVariant: 'outline',
      cancelVariant: 'primary',
      onConfirm: signOut,
    });
  };

  return { signOut, confirmSignOut, isLoading };
};
