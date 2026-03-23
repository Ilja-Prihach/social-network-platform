'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import styles from './AdminSignInForm.module.scss';

export function AdminSignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isSubmitDisabled = email.trim() === '' || password.trim() === '';

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
          />
        </label>
      </div>

      <div className={styles.actions}>
        <button className={styles.submit_button} type="submit" disabled={isSubmitDisabled}>
          Sign In
        </button>
      </div>
    </form>
  );
}
