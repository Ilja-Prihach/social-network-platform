'use client';

import { useEffect, useState } from 'react';
import styles from './CreatePasswordForm.module.scss';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import clsx from 'clsx';

export function CreatePasswordForm() {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [hasError, setHasError] = useState(false);

  const isDisabled = !password || !passwordConfirm || hasError;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!password || !passwordConfirm) {
        setHasError(false);
        return;
      }

      const isInvalid = password.length < 6 || password.length > 20 || password !== passwordConfirm;
      setHasError(isInvalid);
    }, 1000);

    return () => clearTimeout(timer);
  }, [password, passwordConfirm]);

  return (
    <form className={styles.form}>
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
            error={hasError ? 'The passwords must match' : undefined}
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
