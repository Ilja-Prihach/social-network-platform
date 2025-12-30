'use client';

import styles from './forgotPassword.module.scss';
import { RequestPasswordResetForm } from '@/features/RequestPasswordResetForm';

export function ForgotPasswordWidget() {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <RequestPasswordResetForm />
      </div>
    </section>
  );
}
