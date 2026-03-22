import type { ReactNode } from 'react';
import styles from './AuthPageShell.module.scss';

type AuthPageShellVariant = 'sign-in' | 'sign-up';

type AuthPageShellProps = {
  title: ReactNode;
  form: ReactNode;
  variant: AuthPageShellVariant;
  social?: ReactNode;
  footerText?: ReactNode;
  footerAction?: ReactNode;
};

const getPageClassName = (variant: AuthPageShellVariant) => {
  if (variant === 'sign-in') return `${styles.page} ${styles.page_sign_in}`;
  return `${styles.page} ${styles.page_sign_up}`;
};

const getContainerClassName = (variant: AuthPageShellVariant) => {
  if (variant === 'sign-in') return `${styles.container} ${styles.container_sign_in}`;
  return styles.container;
};

const getCardClassName = (variant: AuthPageShellVariant) => {
  if (variant === 'sign-in') return `${styles.card} ${styles.card_sign_in}`;
  return `${styles.card} ${styles.card_sign_up}`;
};

export function AuthPageShell({
  title,
  form,
  variant,
  social,
  footerText,
  footerAction,
}: AuthPageShellProps) {
  const hasFooter = Boolean(footerText || footerAction);

  return (
    <section className={getPageClassName(variant)}>
      <div className={getContainerClassName(variant)}>
        <div className={getCardClassName(variant)}>
          <h2 className={styles.title}>{title}</h2>
          {social ? <div className={styles.social}>{social}</div> : null}
          {form}
          {hasFooter ? (
            <div className={styles.footer}>
              {footerText ? <p className={styles.footer_text}>{footerText}</p> : null}
              {footerAction}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
