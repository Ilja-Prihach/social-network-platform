'use client';

import { Button } from '@/shared/ui/Button';
import styles from './EmailVerificationExpired.module.scss';

type Props = {
  onResendAction: () => void; // Server Action или client callback
};

export const EmailVerificationExpired = ({ onResendAction }: Props) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Email verification link expired</h2>

      <p className={styles.text}>
        Looks like the verification link has expired. Not to worry, we can send the link again
      </p>

      <Button className={styles.button} variant="primary" onClick={onResendAction}>
        Resend link
      </Button>

      <div className={styles.image_placeholder}>
        <span>Image 473x352</span>
      </div>
    </div>
  );
};
