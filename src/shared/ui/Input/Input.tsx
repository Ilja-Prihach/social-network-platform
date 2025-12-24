'use client';
import { ChangeEvent, useState } from 'react';
import styles from './Input.module.scss';
import { Icon } from '@/shared/ui/Icon/Icon';

type InputProps = {
  label: string;
  type?: 'text' | 'password' | 'search';
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
};

export const Input = ({
  label,
  type = 'text',
  value = '', // значение по умолчанию вместо undefined
  onChange,
  disabled = false,
  placeholder,
  error,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isSearch = type === 'search';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const inputId = label.replace(/\s+/g, '_').toLowerCase();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
  };

  const handleSearchClick = () => {
    onChange?.(value);
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
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
    isSearch && styles.input_element_search,
    isPassword && styles.input_element_pass,
    error && styles.error,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.input}>
      <label htmlFor={inputId} className={styles.input_label}>
        {label}
      </label>

      <div className={`${styles.input_box} ${blockClassName}`}>
        {isSearch && (
          <button
            type="button"
            className={styles.search_icon}
            onClick={handleSearchClick}
            disabled={disabled}
          >
            <Icon iconId="search-outline" width="20px" height="20px" />
          </button>
        )}

        <input
          id={inputId}
          type={inputType}
          className={inputClassName}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={handleChange}
        />

        {isPassword && (
          <button
            type="button"
            className={styles.pass_icon}
            onClick={handleTogglePassword}
            disabled={disabled}
          >
            <Icon
              iconId={showPassword ? 'eye-off-outline' : 'eye-outline'}
              width="20px"
              height="20px"
            />
          </button>
        )}
      </div>

      {error && <span className={styles.input_text_error}>{error}</span>}
    </div>
  );
};
// пример
// <Input type={'password'} label={'Email'} placeholder={'Enter Email'} value={'asd@mail.com'}/>
// <Input type={'search'} label={'Email'} placeholder={'Enter Email'} value={'asd@mail.com'}/>
// <Input type={'text'} label={'Email'} placeholder={'Enter Email'} error={'error'} value={'asd@mail.com'}/>
