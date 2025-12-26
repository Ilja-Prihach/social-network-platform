'use client';

import styles from './SignInPage.module.scss';
import { Icon } from '@/shared/ui/Icon';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

export function SignInPage() {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <form className={styles.form}>
          <h2 className={styles.title}>Sign In</h2>
          <div className={styles.head}>
            <a href="#" className={styles.soc_enter}>
              <Icon iconId={'google-svgrepo-com 1'} width={'36px'} height={'36px'} />
            </a>
            <a href="#" className={styles.soc_enter}>
              <Icon iconId={'google-svgrepo-com 1'} width={'36px'} height={'36px'} />
            </a>
          </div>
          <div className={styles.wrapper}>
            <Input label={'Email'} type={'email'} placeholder={'Email'} />
            <Input label={'Password'} type={'password'} placeholder={'Password'} />
          </div>
          <div className={styles.checkbox}>
            <p className={styles.term_text}>
              <Button href="/sign-in" variant="text">
                Forgot Password
              </Button>
            </p>
          </div>
          <Button href="/sign-in" variant="primary" className={styles.button}>
            Sign In
          </Button>
          <p className={styles.text}>Don’t have an account?</p>
          <Button href="/sign-in" variant="text">
            Sign Up
          </Button>
        </form>
      </div>
    </section>
  );
}
