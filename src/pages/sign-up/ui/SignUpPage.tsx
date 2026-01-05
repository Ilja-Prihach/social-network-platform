'use client';

import styles from './SignUpPage.module.scss';
import { Icon } from '@/shared/ui/Icon';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useState } from 'react';
import { InputPassword } from '@/features/auth/input-password';
import { CheckBoxAgreeTerms } from '@/features/auth/check-box-agree-terms';

export function SignUpPage() {
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState('');

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  function checkUserName() {
    if (userName && userName.length > 0) {
      setUserNameError('');
      return true;
    } else {
      setUserNameError('Username must not be empty');
      return false;
    }
  }
  function checkEmail() {
    let re = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let valid = email.match(re);
    if (email && email.length > 0 && valid) {
      setEmailError('');
      return true;
    } else {
      setEmailError('Email must be valid');
      return false;
    }
  }
  function checkPassword() {
    if (password && password.length > 6) {
      setPasswordError('');
      return true;
    } else {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
  }

  function checkPasswordConfirm() {
    if (password === passwordConfirm) {
      setPasswordConfirmError('');
      return true;
    } else {
      setPasswordConfirmError('The passwords must match');
      return false;
    }
  }

  function submitSignUp() {
    if (checkUserName() && checkEmail() && checkPassword() && checkPasswordConfirm()) {
      console.log({
        login: userName,
        email: email,
        password: password,
      });
    } else {
      return false;
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.sign}>
          <h2 className={styles.title}>Sign Up</h2>
          <div className={styles.head}>
            <a href="/#" className={styles.soc_enter}>
              <Icon iconId={'google-svgrepo-com 1'} width={'36px'} height={'36px'} />
            </a>
            <a href="/#" className={styles.soc_enter}>
              <Icon
                iconId={'github-svgrepo-com (3) 1'}
                width={'36px'}
                height={'36px'}
                style={{ color: 'var(--light-100-color)' }}
              />
            </a>
          </div>
          <form className={styles.form}>
            <div className={styles.wrapper}>
              <Input
                label={'Username'}
                type={'text'}
                placeholder={'Username'}
                value={userName}
                onChange={setUserName}
                error={userNameError}
              />
              <Input
                label={'Email'}
                type={'email'}
                placeholder={'Email'}
                value={email}
                onChange={setEmail}
                error={emailError}
              />
              <InputPassword
                label="Password"
                placeholder="Enter password"
                value={password}
                onChange={setPassword}
                error={passwordError}
              />
              <InputPassword
                label="Password confirmation"
                placeholder="Enter password confirmation"
                value={passwordConfirm}
                onChange={setPasswordConfirm}
                error={passwordConfirmError}
              />
            </div>

            <div className={styles.checkbox}>
              <CheckBoxAgreeTerms />
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

            <Button variant="primary" className={styles.button} onClick={submitSignUp}>
              Sign Up
            </Button>
          </form>
          <p className={styles.text}>Do you have an account?</p>
          <Button href="/sign-in" variant="text">
            Sign In
          </Button>
        </div>
      </div>
    </section>
  );
}
