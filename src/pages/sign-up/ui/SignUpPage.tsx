'use client';

import styles from './SignUpPage.module.scss';
import { Icon } from '@/shared/ui/Icon';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { CheckBox } from '@/shared/ui/CheckBox';

export function SignUpPage() {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <form className={styles.form}>
          <h2 className={styles.title}>Sign Up</h2>
          <div className={styles.head}>
            <a href="#" className={styles.soc_enter}>
              <Icon iconId={'google-svgrepo-com 1'} width={'36px'} height={'36px'} />
            </a>
            <a href="#" className={styles.soc_enter}>
              <Icon iconId={'google-svgrepo-com 1'} width={'36px'} height={'36px'} />
            </a>
          </div>
          <div className={styles.wrapper}>
            <Input label={'Username'} type={'text'} placeholder={'Username'} />
            <Input label={'Email'} type={'email'} placeholder={'Email'} />
            <Input label={'Password'} type={'password'} placeholder={'Password'} />
            <Input
              label={'Password confirmation'}
              type={'password'}
              placeholder={'Password confirmation'}
            />
          </div>

          <div className={styles.checkbox}>
            <CheckBox checked={false} onChange={() => {}} />
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

          <Button href="/sign-in" variant="primary" className={styles.button}>
            Sign Up
          </Button>
          <p className={styles.text}>Do you have an account?</p>
          <Button href="/sign-in" variant="text">
            Sign In
          </Button>
        </form>
      </div>
    </section>
  );
}
