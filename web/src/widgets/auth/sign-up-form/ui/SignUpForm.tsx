'use client';

import styles from './SignUpForm.module.scss';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { InputPassword } from '@/features/auth/input-password';
import { CheckBoxAgreeTerms } from '@/features/auth/check-box-agree-terms';
import { useSignUpForm } from '../model/useSignUpForm';
import { useDictionary } from 'next-intlayer';
import signUpFormContent from '../sign-up-form.content';

export function SignUpForm() {
  const content = useDictionary(signUpFormContent);
  const { values, errors, agree, setAgree, submit, isSubmitting } = useSignUpForm();

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.wrapper}>
        <Input
          label={content.userName.value}
          value={values.userName}
          onChange={values.setUserName}
          error={errors.userName}
          disabled={isSubmitting}
        />

        <Input
          label={content.email.value}
          type="email"
          value={values.email}
          onChange={values.setEmail}
          error={errors.email}
          disabled={isSubmitting}
        />

        <InputPassword
          label={content.password.value}
          value={values.password}
          onChange={values.setPassword}
          error={errors.password}
          disabled={isSubmitting}
        />

        <InputPassword
          label={content.passwordConfirm.value}
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
          {content.agreePrefix}{' '}
          <Button href="/terms" variant="text">
            {content.terms}
          </Button>{' '}
          and{' '}
          <Button href="/privacy-policy" variant="text">
            {content.privacy}
          </Button>
        </p>
      </div>

      <Button type="submit" variant="primary" className={styles.button} disabled={isSubmitting}>
        {content.signUp}
      </Button>
    </form>
  );
}
