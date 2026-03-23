'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { loginAdmin } from '../model';
import styles from './AdminSignInForm.module.scss';

export function AdminSignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled = email.trim() === '' || password.trim() === '' || isSubmitting;

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      const result = await loginAdmin({
        email: email.trim(),
        password,
      });

      console.log('loginAdmin result', result);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            className={styles.input}
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            disabled={isSubmitting}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Password</span>
          <input
            className={styles.input}
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
            disabled={isSubmitting}
          />
        </label>
      </div>

      <div className={styles.actions}>
        <button className={styles.submit_button} type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
      </div>
    </form>
  );
}
