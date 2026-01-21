'use client';

import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/shared/ui/Input';
import { InputPassword } from '@/features/auth/input-password';
import styles from './SignInForm.module.scss';
import { Button } from '@/shared/ui/Button';

type SignInFormValues = {
  email: string;
  password: string;
};

export const SignInForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: SignInFormValues) => {
    console.log('test');
    console.log('submit', data);
  };

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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              error={errors.password?.message}
            />
          )}
        />
      </div>
      <p className={styles.term_text}>
        <Button href="/forgot-password" variant="text">
          Forgot Password
        </Button>
      </p>
      <Button variant="primary" className={styles.button} type={'submit'}>
        Sign In
      </Button>
    </form>
  );
};
