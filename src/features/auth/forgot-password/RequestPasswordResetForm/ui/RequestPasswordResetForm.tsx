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

type StatusState = 'idle' | 'loading' | 'success' | 'error';

type Status = {
  state: StatusState;
  message?: string;
  errorMessage?: string;
};

export function RequestPasswordResetForm() {
  const isRecaptchaEnabled = false;

  const [formData, setFormData] = useState({
    email: '',
    recaptchaToken: isRecaptchaEnabled ? '' : 'mock-token',
  });

  // Статус формы с возможной ошибкой
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  const isDisabled = !formData.email || (isRecaptchaEnabled && !formData.recaptchaToken);

  const requestPasswordReset = async (data: { email: string; recaptchaToken: string }) => {
    // Мок запроса
    return new Promise<{ ok: boolean }>((resolve, reject) => {
      setTimeout(() => {
        if (data.email === 'not-exist@mail.com') {
          reject(new Error("User with this email doesn't exist"));
        } else {
          resolve({ ok: true });
        }
      }, 800);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ state: 'loading', errorMessage: undefined });

    try {
      await requestPasswordReset(formData);

      showModal({
        title: 'Email sent',
        description: `We have sent a link to confirm your email to ${formData.email}`,
        confirmText: 'OK',
      });

      setFormData({
        email: '',
        recaptchaToken: isRecaptchaEnabled ? '' : 'mock-token',
      });

      setStatus({ state: 'success', errorMessage: undefined });
    } catch (err) {
      const message = (err as Error).message;

      setStatus({ state: 'error', message, errorMessage: message });

      showModal({
        title: 'Error',
        description: message,
        confirmText: 'OK',
      });
    }
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
          error={status.errorMessage}
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
