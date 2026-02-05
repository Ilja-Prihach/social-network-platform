'use client';

import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/shared/ui/Input';
import { InputPassword } from '@/features/auth/input-password';
import styles from './SignInForm.module.scss';
import { Button } from '@/shared/ui/Button';
import { useDictionary } from 'next-intlayer';
import signInFormContent from '../sign-in-form.content';
import { useSignIn } from '../model/useSignIn';
import { useEffect } from 'react';

type SignInFormValues = {
  email: string;
  password: string;
};

export const SignInForm = () => {
  const content = useDictionary(signInFormContent);
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
    if (!serverError) return;

    const { status, data } = serverError;
    const messages = Array.isArray(data?.messages) ? data.messages : [];
    const messageText = typeof data?.messages === 'string' ? data.messages : undefined;

    if (status === 400 && messages.length) {
      messages.forEach((msg) => {
        if (msg.field === 'email' || msg.field === 'password') {
          setError(msg.field, {
            type: 'server',
            message: msg.message,
          });
        }
      });
      return;
    }

    if (status === 400 && messageText) {
      setError('password', {
        type: 'server',
        message: messageText,
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
            required: content.emailRequired.value,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: content.emailInvalid.value,
            },
          }}
          render={({ field }) => (
            <Input
              label={content.emailLabel.value}
              placeholder={content.emailPlaceholder.value}
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
            required: content.passwordRequired.value,
            minLength: { value: 6, message: content.passwordMin.value },
          }}
          render={({ field }) => (
            <InputPassword
              label={content.passwordLabel.value}
              placeholder={content.passwordPlaceholder.value}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              disabled={isLoading}
              error={errors.password?.message}
            />
          )}
        />
      </div>
      <p className={styles.term_text}>
        <Button
          href="/forgot-password"
          variant="text"
          disabled={isLoading}
          className={styles.forgot_password}
        >
          {content.forgotPassword}
        </Button>
      </p>
      <Button variant="primary" className={styles.button} type={'submit'} disabled={isLoading}>
        {isLoading ? content.signingIn : content.signIn}
      </Button>
    </form>
  );
};
