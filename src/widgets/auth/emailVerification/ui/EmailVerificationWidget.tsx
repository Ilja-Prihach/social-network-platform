'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './EmailVerificationWidget.module.scss';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';
import { useResendVerification } from '@/features/emailVerification/model/useResendVerification';
import { useRecoverPassword } from '@/features/auth/forgot-password/model/useRecoverPassword';
import { useDictionary } from 'next-intlayer';
import emailVerificationContent from '../email-verification.content';

type Variant = 'sign-up' | 'password-recovery';

type Props = {
  variant: Variant;
  email?: string;
};

const STORAGE_KEY = 'forgotPasswordEmail';

export function EmailVerificationWidget({ variant, email: emailProp }: Props) {
  const content = useDictionary(emailVerificationContent);
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
      ? `${content.confirmEmailPrefix.value} ${nextEmail}`
      : `${content.recoveryPrefix.value} ${nextEmail}`;

    mutation(nextEmail, {
      onSuccess: () => {
        showModal({
          title: content.modalTitle.value,
          description: successMessage,
          confirmText: content.ok.value,
        });

        if (isSignUp) {
          setEmail('');
        }
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

  const title = isSignUp ? content.titleSignUp : content.titleRecovery;

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.verif}>
          <h2 className={styles.verif_title}>{title}</h2>
          <p className={styles.verif_text}>
            {content.description}
          </p>
          <div className={styles.verification}>
            {isSignUp && (
              <Input
                type="text"
                placeholder={content.emailPlaceholder.value}
                label={content.emailLabel.value}
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
              {content.resend}
            </Button>
          </div>
          <div className={styles.verif_resend}></div>
          <div className={styles.verif_image}>
            <img
              src="/email-verification.svg"
              alt={content.imageAlt.value}
              className={styles.verif_img}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
