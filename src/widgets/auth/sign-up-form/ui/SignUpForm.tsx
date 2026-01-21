'use client';

import styles from './SignUpForm.module.scss';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { InputPassword } from '@/features/auth/input-password';
import { CheckBoxAgreeTerms } from '@/features/auth/check-box-agree-terms';
import { useSignUpForm } from '../model/useSignUpForm';

export function SignUpForm() {
  const { values, errors, agree, setAgree, submit, isSubmitting } = useSignUpForm();

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.wrapper}>
        <Input
          label="Username"
          value={values.userName}
          onChange={values.setUserName}
          error={errors.userName}
          disabled={isSubmitting}
        />

        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={values.setEmail}
          error={errors.email}
          disabled={isSubmitting}
        />

        <InputPassword
          label="Password"
          value={values.password}
          onChange={values.setPassword}
          error={errors.password}
          disabled={isSubmitting}
        />

        <InputPassword
          label="Password confirmation"
          value={values.passwordConfirm}
          onChange={values.setPasswordConfirm}
          error={errors.passwordConfirm}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.checkbox}>
        <CheckBoxAgreeTerms
          checked={agree}
          error={errors.agree}
          onChangeAction={setAgree}
          disabled={isSubmitting}
        />
        <p className={styles.term_text}>
          I agree to the{' '}
          <Button href="/terms" variant="text">
            Terms of Service
          </Button>{' '}
          and{' '}
          <Button href="/privacy-policy" variant="text">
            Privacy Policy
          </Button>
        </p>
      </div>

      <Button type="submit" variant="primary" className={styles.button} disabled={isSubmitting}>
        Sign Up
      </Button>
    </form>
  );
}
