'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './Select.module.scss';

type SelectOption<TValue extends string = string> = {
  title: string;
  value: TValue;
  icon?: ReactNode;
};

type SelectProps<TValue extends string = string> = {
  className?: string;
  options: Array<SelectOption<TValue>>;
  value?: TValue | null;
  placeholder?: string;
  onChange?: (value: TValue) => void;
  disabled?: boolean;
  label?: string;
};

const joinClassNames = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(' ');

export function Select<TValue extends string = string>({
  options,
  value,
  placeholder,
  onChange,
  disabled,
  label,
  className,
}: SelectProps<TValue>) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!rootRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handler);

    return () => document.removeEventListener('click', handler);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handler);

    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  const selectedOption = options.find((option) => option.value === value);
  const selectedTitle = selectedOption ? selectedOption.title : placeholder;

  const selectValue = (nextValue: TValue) => {
    if (disabled) return;

    setIsOpen(false);
    onChange?.(nextValue);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setIsOpen(true);
        setActiveIndex((index) => Math.min(index + 1, options.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case 'Enter': {
        if (!isOpen) return;

        event.preventDefault();
        const option = options[activeIndex];

        if (option) {
          selectValue(option.value);
        }

        break;
      }
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
    }
  };

  return (
    <div data-open={isOpen} className={joinClassNames(styles.root, className)} ref={rootRef}>
      {label ? <span className={styles.label_title}>{label}</span> : null}
      <button
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => !disabled && setIsOpen((open) => !open)}
        onKeyDown={handleKeyDown}
        ref={buttonRef}
        disabled={disabled}
        title={selectedTitle}
        type="button"
      >
        <span className={styles.value_wrapper}>
          {selectedOption?.icon ? <span className={styles.icon}>{selectedOption.icon}</span> : null}
          <span className={styles.label} title={selectedTitle}>
            {selectedTitle}
          </span>
        </span>
        <span className={styles.arrow} aria-hidden>
          ▾
        </span>
      </button>

      {isOpen ? (
        <ul className={styles.list} role="listbox">
          {options.map((option, index) => (
            <li
              className={joinClassNames(
                styles.option,
                index === activeIndex && styles.option_active,
              )}
              role="option"
              aria-selected={option.value === value}
              key={option.value}
              onClick={() => selectValue(option.value)}
              title={option.title}
            >
              {option.icon ? <span className={styles.icon}>{option.icon}</span> : null}
              {option.title}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
