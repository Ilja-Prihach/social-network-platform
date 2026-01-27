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
import { useDictionary } from 'next-intlayer';
import requestPasswordResetContent from '../request-password-reset.content';

const STORAGE_KEY = 'forgotPasswordEmail';

export function RequestPasswordResetForm() {
  const content = useDictionary(requestPasswordResetContent);
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
          title: content.modalTitle.value,
          description: `${content.sentPrefix.value} ${email}`,
          confirmText: content.modalConfirm.value,
        });

        window.localStorage.setItem(STORAGE_KEY, email);
        setEmail('');
        setRecaptchaToken('');
      },
      onError: (error) => {
        showModal({
          title: content.errorTitle.value,
          description: (error as Error).message,
          confirmText: content.modalConfirm.value,
        });
      },
    });
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
        <p className={styles.description}>
          {content.description}
        </p>
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
          <Recaptcha siteKey={recaptchaSiteKey!} onChange={(token) => setRecaptchaToken(token)} />
        )}
      </div>
    </form>
  );
}
