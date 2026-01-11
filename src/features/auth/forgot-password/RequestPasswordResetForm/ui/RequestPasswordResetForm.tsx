// Фронт ожидает переменную
// NEXT_PUBLIC_RECAPTCHA_SITE_KEY

'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Recaptcha } from '@/shared/ui/Recaptcha/Recaptcha';
import styles from './RequestPasswordResetForm.module.scss';
import { Input } from '@/shared/ui/Input';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';
import { useRecoverPassword } from '@/features/auth/forgot-password/model/useRecoverPassword';

const STORAGE_KEY = 'forgotPasswordEmail';

export function RequestPasswordResetForm() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const isRecaptchaEnabled = Boolean(recaptchaSiteKey);

  const [email, setEmail] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');

  const { mutate, isPending } = useRecoverPassword();
  const isDisabled = !email || (isRecaptchaEnabled && !recaptchaToken) || isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(email, {
      onSuccess: () => {
        showModal({
          title: 'Email sent',
          description: `We have sent a link to confirm your email to ${email}`,
          confirmText: 'OK',
        });

        window.localStorage.setItem(STORAGE_KEY, email);
        setEmail('');
        setRecaptchaToken('');
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

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Forgot Password</h2>

      <div className={styles.email_wrapper}>
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
        />
        <p className={styles.description}>
          Enter your email and we will send you further instruction
        </p>
      </div>

      <div className={styles.button_wrapper}>
        <Button className={styles.button} variant="primary" type="submit" disabled={isDisabled}>
          Send link
        </Button>

        <Button href="/sign-in" variant="text">
          Back to Sign In
        </Button>
      </div>
      <div className={styles.recaptcha}>
        {isRecaptchaEnabled && (
          <Recaptcha siteKey={recaptchaSiteKey!} onChange={(token) => setRecaptchaToken(token)} />
        )}
      </div>
    </form>
  );
}
