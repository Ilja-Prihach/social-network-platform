// Фронт ожидает переменную
// NEXT_PUBLIC_RECAPTCHA_SITE_KEY
// и будет отправлять recaptchaToken в POST /auth/forgot-password

'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Recaptcha } from '@/shared/ui/Recaptcha/Recaptcha';
import styles from './RequestPasswordResetForm.module.scss';
import { Input } from '@/shared/ui/Input';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';
import { useRecoverPassword } from '@/features/auth/forgot-password/model/useRecoverPassword';

export function RequestPasswordResetForm() {
  const isRecaptchaEnabled = false;

  const [formData, setFormData] = useState({
    email: '',
    recaptchaToken: isRecaptchaEnabled ? '' : 'mock-token',
  });

  const { mutate, isPending } = useRecoverPassword();
  const isDisabled = !formData.email || isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(formData.email, {
      onSuccess: () => {
        showModal({
          title: 'Email sent',
          description: `We have sent a link to confirm your email to ${formData.email}`,
          confirmText: 'OK',
        });

        setFormData({
          email: '',
          recaptchaToken: isRecaptchaEnabled ? '' : 'mock-token',
        });
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
          value={formData.email}
          onChange={(val) => setFormData((prev) => ({ ...prev, email: val }))}
        />
        <p className={styles.description}>
          Enter your email and we will send you further instructions
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
          <Recaptcha
            siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) => setFormData((prev) => ({ ...prev, recaptchaToken: token }))}
          />
        )}
      </div>
    </form>
  );
}
