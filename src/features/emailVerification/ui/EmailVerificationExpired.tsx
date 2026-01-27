'use client';

import { Button } from '@/shared/ui/Button';
import styles from './EmailVerificationExpired.module.scss';
import { useDictionary } from 'next-intlayer';
import emailVerificationExpiredContent from '../email-verification-expired.content';

type Props = {
  onResendAction: () => void; // Server Action или client callback
};

export const EmailVerificationExpired = ({ onResendAction }: Props) => {
  const content = useDictionary(emailVerificationExpiredContent);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{content.title}</h2>

      <p className={styles.text}>
        {content.description}
      </p>

      <Button className={styles.button} variant="primary" onClick={onResendAction}>
        {content.resend}
      </Button>

      <div className={styles.image_placeholder}>
        <span>{content.imagePlaceholder}</span>
      </div>
    </div>
  );
};
