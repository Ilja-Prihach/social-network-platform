'use client';

import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/shared/ui/Input';
import { InputPassword } from '@/features/auth/input-password';
import styles from './SignInForm.module.scss';
import { Button } from '@/shared/ui/Button';
import { useSignIn } from '../model/useSignIn';
import { useEffect } from 'react';

type SignInFormValues = {
  email: string;
  password: string;
};

export const SignInForm = () => {
  const { mutate, isPending, error: serverError } = useSignIn();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    const error = serverError as unknown;
    if (error?.status === 400 && error.data?.messages) {
      error.data.messages.forEach((msg: { field: string; message: string }) => {
        if (msg.field === 'email' || msg.field === 'password') {
          setError(msg.field as keyof SignInFormValues, {
            type: 'server',
            message: msg.message,
          });
        }
      });
    }
  }, [serverError, setError]);

  const onSubmit = (data: SignInFormValues) => {
    mutate(data);
  };

  const isLoading = isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.wrapper}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email обязателен',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Некорректный email',
            },
          }}
          render={({ field }) => (
            <Input
              label="Email"
              placeholder="Email"
              type="email"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              disabled={isLoading}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Пароль обязателен',
            minLength: { value: 6, message: 'Минимум 6 символов' },
          }}
          render={({ field }) => (
            <InputPassword
              label="Password"
              placeholder="Password"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              disabled={isLoading}
              error={errors.password?.message}
            />
          )}
        />
      </div>
      <p className={styles.term_text}>
        <Button href="/forgot-password" variant="text" disabled={isLoading}>
          Forgot Password
        </Button>
      </p>
      <Button variant="primary" className={styles.button} type={'submit'} disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};
