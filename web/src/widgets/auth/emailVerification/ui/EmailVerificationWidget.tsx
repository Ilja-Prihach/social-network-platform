'use client';

import styles from './EmailVerificationWidget.module.scss';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useDictionary } from 'next-intlayer';
import emailVerificationContent from '../email-verification.content';
import { useEmailVerificationResend } from '../model/useEmailVerificationResend';

type Variant = 'sign-up' | 'password-recovery';

type Props = {
  variant: Variant;
  email?: string;
};

export function EmailVerificationWidget({ variant, email: emailProp }: Props) {
  const content = useDictionary(emailVerificationContent);
  const { email, setEmail, isSignUp, isDisabled, handleResend } = useEmailVerificationResend({
    variant,
    email: emailProp,
    copy: {
      confirmEmailPrefix: content.confirmEmailPrefix.value,
      recoveryPrefix: content.recoveryPrefix.value,
      modalTitle: content.modalTitle.value,
      ok: content.ok.value,
      errorTitle: content.errorTitle.value,
    },
  });

  const title = isSignUp ? content.titleSignUp : content.titleRecovery;

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.verif}>
          <h2 className={styles.verif_title}>{title}</h2>
          <p className={styles.verif_text}>{content.description}</p>
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
