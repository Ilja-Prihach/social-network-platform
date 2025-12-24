import { ChangeEvent, useEffect, useState } from 'react';
import styles from './Input.module.scss';

type InputProps = {
    label: string;
    type: string;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    error?: string;
};

export const Input = ({
                          label,
                          type = 'text',
                          value: externalValue,
                          onChange,
                          disabled = false,
                          placeholder,
                          error,
                      }: InputProps) => {
    const [value, setValue] = useState('');

    const inputId = label.replace(/\s+/g, '_').toLowerCase();

    useEffect(() => {
        if (externalValue !== undefined) {
            setValue(externalValue);
        }
    }, [externalValue]);

    const inputClassName = `
        ${styles.input_element}
        ${error ? styles.error : ''}
        ${type==='search' ? styles.input_element_search : ''}
        ${type==='password' ? styles.input_element_pass : ''}
    `.trim();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        setValue(newValue);
        onChange?.(newValue);
    };

    return (
        <div className={styles.input}>
            <label htmlFor={inputId} className={styles.input_label}>
                {label}
            </label>

            <div className={styles.input_box}>
                {type === 'search' && (
                    <div className={styles.search_icon}></div>
                )}

                <input
                    id={inputId}
                    type={type}
                    className={inputClassName}
                    placeholder={placeholder}
                    disabled={disabled}
                    value={value}
                    onChange={handleChange}
                />

                {type === 'password' && (
                    <div className={styles.pass_icon}></div>
                )}
            </div>

            {error && (
                <span className={styles.input_text_error}>
                    {error}
                </span>
            )}
        </div>
    );
};

