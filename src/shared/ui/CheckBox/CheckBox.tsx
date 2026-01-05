import styles from './styles.module.scss';
import { Icon } from '@/shared/ui/Icon';

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
};

export const CheckBox = ({ checked, onChange, disabled, label, error }: Props) => {
  const checkboxClassName = [styles.input, error && styles.error].filter(Boolean).join(' ');

  return (
    <label className={styles.wrapper}>
      <input
        type="checkbox"
        className={checkboxClassName}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.box}>
        {checked && (
          <Icon
            iconId={'checkmark-outline'}
            style={{
              color: disabled ? 'var(--light-100-color)' : 'var(--dark-900-color)',
              transform: 'scale(1.2)',
            }}
            width={'24px'}
            height={'24px'}
          />
        )}
      </span>
      {label && (
        <span className={disabled ? styles.label_span_disabled : styles.label_span}>{label} </span>
      )}
    </label>
  );
};
