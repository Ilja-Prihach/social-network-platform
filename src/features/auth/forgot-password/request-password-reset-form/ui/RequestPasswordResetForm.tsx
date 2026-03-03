'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { Recaptcha } from '@/shared/ui/Recaptcha/Recaptcha';
import styles from './RequestPasswordResetForm.module.scss';
import { Input } from '@/shared/ui/Input';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';
import { useRecoverPassword } from '@/features/auth/forgot-password/model/useRecoverPassword';
import { useDictionary } from 'next-intlayer';
import requestPasswordResetContent from '../request-password-reset.content';
import Script from 'next/script';

const STORAGE_KEY = 'forgotPasswordEmail';

const getLocaleFromParams = (params: ReturnType<typeof useParams>) => {
  const locale = params?.locale;
  if (typeof locale === 'string') return locale;
  if (Array.isArray(locale)) return locale[0];
  return undefined;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
};

export function RequestPasswordResetForm() {
  const content = useDictionary(requestPasswordResetContent);
  const params = useParams();
  const locale = getLocaleFromParams(params);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const isRecaptchaEnabled = Boolean(recaptchaSiteKey);

  const [email, setEmail] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | undefined>(undefined);

  const { mutate, isPending } = useRecoverPassword();
  const trimmedEmail = email.trim();
  const isDisabled = !trimmedEmail || (isRecaptchaEnabled && !recaptchaToken) || isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!trimmedEmail) return;
    if (isRecaptchaEnabled && !recaptchaToken) return;

    mutate(
      { email: trimmedEmail, recaptcha: recaptchaToken, locale },
      {
        onSuccess: () => {
          showModal({
            title: content.modalTitle.value,
            description: `${content.sentPrefix.value} ${trimmedEmail}`,
            confirmText: content.modalConfirm.value,
          });

          if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, trimmedEmail);
          }
          setEmail('');
          setRecaptchaToken(undefined);
        },
        onError: (error) => {
          showModal({
            title: content.errorTitle.value,
            description: getErrorMessage(error, content.errorTitle.value),
            confirmText: content.modalConfirm.value,
          });
        },
      },
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>{content.title}</h2>

      <div className={styles.email_wrapper}>
        <Input
          label={content.emailLabel.value}
          type="email"
          placeholder={content.emailPlaceholder.value}
          value={email}
          onChange={setEmail}
        />
        <p className={styles.description}>{content.description}</p>
      </div>

      <div className={styles.button_wrapper}>
        <Button className={styles.button} variant="primary" type="submit" disabled={isDisabled}>
          {content.sendLink}
        </Button>

        <Button href="/sign-in" variant="text">
          {content.backToSignIn}
        </Button>
      </div>
      <div className={styles.recaptcha}>
        {isRecaptchaEnabled && (
          <>
            <Script
              src="https://www.google.com/recaptcha/api.js?render=explicit"
              strategy="afterInteractive"
            />
            <Recaptcha
              siteKey={recaptchaSiteKey!}
              onChange={(token) => setRecaptchaToken(token || undefined)}
            />
          </>
        )}
      </div>
    </form>
  );
}
