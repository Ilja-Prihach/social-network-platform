import styles from './forgotPassword.module.scss';
import { RequestPasswordResetForm } from '@/features/auth/forgot-password/request-password-reset-form';

export function ForgotPasswordWidget() {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <RequestPasswordResetForm />
      </div>
    </section>
  );
}
