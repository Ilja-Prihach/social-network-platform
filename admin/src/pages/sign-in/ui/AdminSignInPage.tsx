import type { Metadata } from 'next';
import { AdminSignInForm } from '@/features/sign-in';
import styles from './AdminSignInPage.module.scss';

export const metadata: Metadata = {
  title: 'SocialNetwork-AI SuperAdmin | Sign In',
};

export function AdminSignInPage() {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Sign In</h1>
          <AdminSignInForm />
        </div>
      </div>
    </section>
  );
}
