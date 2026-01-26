'use client';

import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/shared/ui/Input';
import { InputPassword } from '@/features/auth/input-password';
import styles from './SignInForm.module.scss';
import { Button } from '@/shared/ui/Button';
import { useDictionary } from 'next-intlayer';
import signInFormContent from '../sign-in-form.content';

type SignInFormValues = {
  email: string;
  password: string;
};

export const SignInForm = () => {
  const content = useDictionary(signInFormContent);
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              error={errors.password?.message}
            />
          )}
        />
      </div>
      <p className={styles.term_text}>
        <Button href="/forgot-password" variant="text">
          {content.forgotPassword}
        </Button>
      </p>
      <Button variant="primary" className={styles.button} type={'submit'}>
        {content.signIn}
      </Button>
    </form>
  );
};
