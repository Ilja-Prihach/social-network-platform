'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './createPassword.module.scss';
import { CreatePasswordForm } from '@/features/auth/forgot-password/reset-password-form';
import { EmailVerificationExpired } from '@/features/emailVerification/ui/EmailVerificationExpired';
import { useRecoverPassword } from '@/features/auth/forgot-password/model/useRecoverPassword';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';
import { useDictionary } from 'next-intlayer';
import createPasswordWidgetContent from '../create-password-widget.content';

const STORAGE_KEY = 'forgotPasswordEmail';

export function CreatePasswordWidget() {
  const content = useDictionary(createPasswordWidgetContent);
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

    mutate(email, {
      onSuccess: () => {
        showModal({
          title: content.modalTitle.value,
          description: `${content.sentPrefix.value} ${email}`,
          confirmText: content.ok.value,
        });
      },
      onError: (error) => {
        showModal({
          title: content.errorTitle.value,
          description: (error as Error).message,
          confirmText: content.ok.value,
        });
      },
    });
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
