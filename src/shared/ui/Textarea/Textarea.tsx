import React, { TextareaHTMLAttributes, useId } from 'react';
import styles from './Textarea.module.scss';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  helperText,
  error = false,
  errorMessage,
  disabled = false,
  className = '',
  id,
  placeholder = 'Введите текст...',
  ...textareaProps
}) => {
  // Используем useId для генерации стабильного уникального ID
  const generatedId = useId();
  const textareaId = id || `textarea-${generatedId}`;

  // Определяем классы для textarea
  const textareaClasses = [
    styles.textarea_field,
    disabled && styles.textarea_field_disabled,
    error && styles.textarea_field_error,
  ]
    .filter(Boolean)
    .join(' ');

  // Определяем, показывать ли helper text
  const showHelper = helperText || (error && errorMessage);
  const helperClass = error ? styles.textarea_helper_error : styles.textarea_helper_default;

  return (
    <div className={`${styles.textarea_wrapper} ${className}`}>
      <label htmlFor={textareaId} className={styles.textarea_label}>
        {label}
      </label>

      <div className={styles.textarea_container}>
        <textarea
          id={textareaId}
          className={textareaClasses}
          disabled={disabled}
          aria-invalid={error}
          aria-describedby={showHelper ? `${textareaId}-helper` : undefined}
          placeholder={placeholder}
          {...textareaProps}
        />
      </div>

      {showHelper && (
        <div id={`${textareaId}-helper`} className={`${styles.textarea_helper} ${helperClass}`}>
          {error && errorMessage ? errorMessage : helperText}
        </div>
      )}
    </div>
  );
};

export default Textarea;
