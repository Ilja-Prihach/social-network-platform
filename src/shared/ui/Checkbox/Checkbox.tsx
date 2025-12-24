'use client';

import styles from './styles.module.scss';

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label?: string;
};

export const Checkbox = ({ checked, onChange, disabled, label }: Props) => {
  return (
    <label className={styles.wrapper}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.box}>
        <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24">
          <use href="#check-mark" />
        </svg>
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};
