import { ChangeEvent, ReactNode } from 'react';
import styles from './Input.module.scss';

export type InputProps = {
  id?: string;
  label?: string;
  type?: 'text' | 'password' | 'email' | 'search';
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: ReactNode;
  dir?: 'ltr' | 'rtl';
  readonly?: boolean;

  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
};

export const Input = ({
  id,
  label,
  type = 'text',
  value = '',
  onChange,
  disabled = false,
  placeholder,
  error,
  dir = 'ltr',
  readonly = false,
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,
}: InputProps) => {
  const inputId = id ?? label?.replace(/\s+/g, '_').toLowerCase();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const blockClassName = [
    styles.block,
    error && styles.block_error,
    disabled && styles.block_disabled,
  ]
    .filter(Boolean)
    .join(' ');

  const inputClassName = [
    styles.input_element,
    leftIcon && styles.input_element_search,
    rightIcon && styles.input_element_pass,
    error && styles.error,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.input}>
      {label && (
        <label htmlFor={inputId} className={styles.input_label}>
          {label}
        </label>
      )}

      <div className={`${styles.input_box} ${blockClassName}`}>
        {leftIcon && (
          <button
            type="button"
            className={styles.search_icon}
            onClick={onLeftIconClick}
            disabled={disabled}
          >
            {leftIcon}
          </button>
        )}

        <input
          id={inputId}
          type={type}
          className={inputClassName}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          dir={dir}
          readOnly={readonly}
        />

        {rightIcon && (
          <button
            type="button"
            className={styles.pass_icon}
            onClick={onRightIconClick}
            disabled={disabled}
          >
            {rightIcon}
          </button>
        )}
      </div>

      {error && <span className={styles.input_text_error}>{error}</span>}
    </div>
  );
};
