'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './EmailVerificationWidget.module.scss';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';
import { useResendVerification } from '@/features/emailVerification/model/useResendVerification';
import { useRecoverPassword } from '@/features/auth/forgot-password/model/useRecoverPassword';

type Variant = 'sign-up' | 'password-recovery';

type Props = {
  variant: Variant;
  email?: string;
};

const STORAGE_KEY = 'forgotPasswordEmail';

export function EmailVerificationWidget({ variant, email: emailProp }: Props) {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(emailProp ?? '');

  const { mutate: resendVerification, isPending: isVerificationPending } = useResendVerification();
  const { mutate: resendRecovery, isPending: isRecoveryPending } = useRecoverPassword();

  const isSignUp = variant === 'sign-up';

  const fallbackEmail = useMemo(() => {
    if (emailProp) return emailProp;

    const queryEmail = searchParams?.get('email') ?? undefined;
    if (queryEmail) return queryEmail;

    if (typeof window === 'undefined') return undefined;
    return window.localStorage.getItem(STORAGE_KEY) ?? undefined;
  }, [emailProp, searchParams]);

  const activeEmail = isSignUp ? email : (fallbackEmail ?? '');
  const isPending = isSignUp ? isVerificationPending : isRecoveryPending;
  const isDisabled = !activeEmail.trim() || isPending;

  const handleResend = () => {
    const nextEmail = activeEmail.trim();

    if (!nextEmail) return;

    const mutation = isSignUp ? resendVerification : resendRecovery;
    const successMessage = isSignUp
      ? `We have sent a link to confirm your email to ${nextEmail}`
      : `We have sent a password recovery link to ${nextEmail}`;

    mutation(nextEmail, {
      onSuccess: () => {
        showModal({
          title: 'Email sent',
          description: successMessage,
          confirmText: 'OK',
        });

        if (isSignUp) {
          setEmail('');
        }
      },
      onError: (error) => {
        showModal({
          title: 'Error',
          description: (error as Error).message,
          confirmText: 'OK',
        });
      },
    });
  };

  const title = isSignUp ? 'Email verification link expired' : 'Password Recovery';

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.verif}>
          <h2 className={styles.verif_title}>{title}</h2>
          <p className={styles.verif_text}>
            Looks like the verification link has expired. Not to worry, we can send the link again
          </p>
          <div className={styles.verification}>
            {isSignUp && (
              <Input
                type="text"
                placeholder="Epam@epam.com"
                label="Email"
                value={email}
                onChange={setEmail}
              />
            )}
            <Button
              variant="primary"
              className={styles.verification_button}
              type="button"
              disabled={isDisabled}
              onClick={handleResend}
            >
              Resend verification link
            </Button>
          </div>
          <div className={styles.verif_resend}></div>
          <div className={styles.verif_image}>
            <img
              src="/email-verification.svg"
              alt="Resend verification"
              className={styles.verif_img}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
