'use client';

import { useEffect, useState } from 'react';
import styles from './CreatePasswordForm.module.scss';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';
import { useCreateNewPassword } from '@/features/auth/forgot-password/model/useCreateNewPassword';
import { useRouter } from 'next/navigation';
import { useDictionary } from 'next-intlayer';
import createPasswordFormContent from '../create-password-form.content';

type CreatePasswordFormProps = {
  recoveryCode?: string;
  onExpired?: () => void;
};

const isRecoveryCodeError = (message: string) => {
  const value = message.toLowerCase();
  return value.includes('recovery') || value.includes('code') || value.includes('expired');
};

export function CreatePasswordForm({ recoveryCode, onExpired }: CreatePasswordFormProps) {
  const content = useDictionary(createPasswordFormContent);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [hasMismatch, setHasMismatch] = useState(false);
  const [isLengthInvalid, setIsLengthInvalid] = useState(false);

  const router = useRouter();
  const { mutate, isPending } = useCreateNewPassword();

  const isDisabled = !password || !passwordConfirm || isPending;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!password || !passwordConfirm) {
        setHasMismatch(false);
        setIsLengthInvalid(false);
        return;
      }

      setHasMismatch(password !== passwordConfirm);
      setIsLengthInvalid(password.length < 6 || password.length > 20);
    }, 600);

    return () => clearTimeout(timer);
  }, [password, passwordConfirm]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasMismatch) {
      showModal({
        title: content.errorTitle.value,
        description: content.mismatchError.value,
        confirmText: content.ok.value,
      });
      return;
    }

    if (isLengthInvalid) {
      showModal({
        title: content.errorTitle.value,
        description: content.lengthError.value,
        confirmText: content.ok.value,
      });
      return;
    }

    if (!recoveryCode) {
      onExpired?.();
      return;
    }

    mutate(
      { newPassword: password, recoveryCode },
      {
        onSuccess: () => {
          router.push('/sign-in');
        },
        onError: (error) => {
          const message = (error as Error).message;

          if (isRecoveryCodeError(message)) {
            onExpired?.();
            return;
          }

          showModal({
            title: content.errorTitle.value,
            description: message,
            confirmText: content.ok.value,
          });
        },
      },
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>{content.title}</h2>

      <div className={styles.input_wrapper}>
        <Input
          label={content.newPasswordLabel.value}
          type="password"
          placeholder={content.newPasswordPlaceholder.value}
          value={password}
          onChange={setPassword}
        />

        <div className={styles.confirm_wrapper}>
          <Input
            label={content.confirmLabel.value}
            type="password"
            placeholder={content.confirmPlaceholder.value}
            value={passwordConfirm}
            onChange={setPasswordConfirm}
            error={hasMismatch ? content.mismatchError.value : undefined}
          />
          <p className={styles.pass_descr}>{content.hint}</p>
        </div>
      </div>

      <div className={styles.button_wrapper}>
        <Button className={styles.button} type="submit" variant="primary" disabled={isDisabled}>
          {content.submit}
        </Button>
      </div>
    </form>
  );
}
