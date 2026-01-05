'use client';

import styles from './SignUpPage.module.scss';
import { Icon } from '@/shared/ui/Icon';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { CheckBox } from '@/shared/ui/CheckBox';
import { useState } from 'react';
import { InputPassword } from '@/features/auth/input-password';

export function SignUpPage() {
  const [password, setPassword] = useState('');

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.sign}>
          <h2 className={styles.title}>Sign Up</h2>
          <div className={styles.head}>
            <a href="#" className={styles.soc_enter}>
              <Icon iconId={'google-svgrepo-com 1'} width={'36px'} height={'36px'} />
            </a>
            <a href="#" className={styles.soc_enter}>
              <Icon iconId={'google-svgrepo-com 1'} width={'36px'} height={'36px'} />
            </a>
          </div>
          <form className={styles.form}>
            <div className={styles.wrapper}>
              <Input label={'Username'} type={'text'} placeholder={'Username'} />
              <Input label={'Email'} type={'email'} placeholder={'Email'} />
              <InputPassword
                label="Password"
                placeholder="Enter password"
                value={password}
                onChange={setPassword}
              />
              <InputPassword
                label="Password confirmation"
                placeholder="Enter password confirmation"
                value={password}
                onChange={setPassword}
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
          </form>
          <p className={styles.text}>Do you have an account?</p>
          <Button href="/sign-in" variant="text">
            Sign In
          </Button>
        </div>
        <div className={styles.congrat}>
          <div className={styles.congrat_body}>
            <h2 className={styles.congrat_title}>Congratulations!</h2>
            <p className={styles.congrat_text}>Your email has been confirmed</p>
            <Button href="/sign-in" variant="primary" className={styles.congrat_button}>
              Sign In
            </Button>
            <div className={styles.congrat_image}>
              <img src="" alt="Congratulations" className={styles.congrat_img} />
            </div>
          </div>
        </div>
        <div className={styles.verif}>
          <h2 className={styles.verif_title}>Email verification link expired</h2>
          <p className={styles.verif_text}>
            Looks like the verification link has expired. Not to worry, we can send the link again
          </p>
          <div className={styles.verification}>
            <Input type={'text'} placeholder={'Epam@epam.com'} label={'Email'} />
            <Button href="/sign-in" variant="primary" className={styles.verification_button}>
              Sign In
            </Button>
          </div>
          <div className={styles.verif_resend}></div>
          <div className={styles.verif_image}>
            <img src="" alt="Resend verification" className={styles.verif_img} />
          </div>
        </div>
      </div>
    </section>
  );
}
