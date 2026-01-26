'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './createPassword.module.scss';
import { CreatePasswordForm } from '@/features/auth/forgot-password/ResetPasswordForm';
import { EmailVerificationExpired } from '@/features/emailVerification/ui/EmailVerificationExpired';
import { useRecoverPassword } from '@/features/auth/forgot-password/model/useRecoverPassword';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';

const STORAGE_KEY = 'forgotPasswordEmail';

export function CreatePasswordWidget() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const recoveryCode = searchParams?.get('recoveryCode') ?? searchParams?.get('code') ?? undefined;
  const emailParam = searchParams?.get('email') ?? undefined;

  const [isExpired, setIsExpired] = useState(!recoveryCode);

  const { mutate } = useRecoverPassword();

  const handleResend = () => {
    const storedEmail =
      typeof window !== 'undefined'
        ? (window.localStorage.getItem(STORAGE_KEY) ?? undefined)
        : undefined;
    const email = emailParam ?? storedEmail;

    if (!email) {
      router.push('/forgot-password');
      return;
    }

    mutate(
      { email },
      {
        onSuccess: () => {
          showModal({
            title: 'Email sent',
            description: `We have sent a link to confirm your email to ${email}`,
            confirmText: 'OK',
          });
        },
        onError: (error) => {
          showModal({
            title: 'Error',
            description: (error as Error).message,
            confirmText: 'OK',
          });
        },
      },
    );
  };

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        {isExpired ? (
          <EmailVerificationExpired onResendAction={handleResend} />
        ) : (
          <CreatePasswordForm recoveryCode={recoveryCode} onExpired={() => setIsExpired(true)} />
        )}
      </div>
    </section>
  );
}
