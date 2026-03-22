import type { FormEventHandler, ReactNode } from 'react';
import styles from './CredentialsForm.module.scss';

type CredentialsFormProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  fields: ReactNode;
  submit: ReactNode;
  footer?: ReactNode;
};

export function CredentialsForm({ onSubmit, fields, submit, footer }: CredentialsFormProps) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.fields}>{fields}</div>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
      <div className={styles.actions}>{submit}</div>
    </form>
  );
}
