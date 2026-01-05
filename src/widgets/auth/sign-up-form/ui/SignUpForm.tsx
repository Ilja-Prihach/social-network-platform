'use client';

import styles from './SignUpForm.module.scss';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { InputPassword } from '@/features/auth/input-password';
import { CheckBoxAgreeTerms } from '@/features/auth/check-box-agree-terms';
import { useSignUpForm } from '../model/useSignUpForm';

export function SignUpForm() {
  const { values, errors, agree, setAgree, submit } = useSignUpForm();

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.wrapper}>
        <Input
          label="Username"
          value={values.userName}
          onChange={values.setUserName}
          error={errors.userName}
        />

        <Input label="Email" value={values.email} onChange={values.setEmail} error={errors.email} />

        <InputPassword
          label="Password"
          value={values.password}
          onChange={values.setPassword}
          error={errors.password}
        />

        <InputPassword
          label="Password confirmation"
          value={values.passwordConfirm}
          onChange={values.setPasswordConfirm}
          error={errors.passwordConfirm}
        />
      </div>

      <div className={styles.checkbox}>
        <CheckBoxAgreeTerms checked={agree} error={errors.agree} onChangeAction={setAgree} />
        <p className={styles.term_text}>
          I agree to the{' '}
          <Button href="/sign-in" variant="text">
            Terms of Service
          </Button>{' '}
          and{' '}
          <Button href="/sign-in" variant="text">
            Privacy Policy
          </Button>
        </p>
      </div>

      <Button type="submit" variant="primary" className={styles.button}>
        Sign Up
      </Button>
    </form>
  );
}
