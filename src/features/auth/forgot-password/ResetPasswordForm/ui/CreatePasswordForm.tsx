'use client';

import { useEffect, useState } from 'react';
import styles from './CreatePasswordForm.module.scss';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';
import { useCreateNewPassword } from '@/features/auth/forgot-password/model/useCreateNewPassword';
import { useRouter } from 'next/navigation';

type CreatePasswordFormProps = {
  recoveryCode?: string;
  onExpired?: () => void;
};

const isRecoveryCodeError = (message: string) => {
  const value = message.toLowerCase();
  return value.includes('recovery') || value.includes('code') || value.includes('expired');
};

export function CreatePasswordForm({ recoveryCode, onExpired }: CreatePasswordFormProps) {
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
        title: 'Error',
        description: 'Passwords must match',
        confirmText: 'OK',
      });
      return;
    }

    if (isLengthInvalid) {
      showModal({
        title: 'Error',
        description: 'Password must be between 6 and 20 characters',
        confirmText: 'OK',
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
            title: 'Error',
            description: message,
            confirmText: 'OK',
          });
        },
      },
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Create New Password</h2>

      <div className={styles.input_wrapper}>
        <Input
          label="New password"
          type="password"
          placeholder="New Password"
          value={password}
          onChange={setPassword}
        />

        <div className={styles.confirm_wrapper}>
          <Input
            label="Confirm password"
            type="password"
            placeholder="Password confirmation"
            value={passwordConfirm}
            onChange={setPasswordConfirm}
            error={hasMismatch ? 'Passwords must match' : undefined}
          />
          <p className={styles.pass_descr}>Your password must be between 6 and 20 characters</p>
        </div>
      </div>

      <div className={styles.button_wrapper}>
        <Button className={styles.button} type="submit" variant="primary" disabled={isDisabled}>
          Create new password
        </Button>
      </div>
    </form>
  );
}
