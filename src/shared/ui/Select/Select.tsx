import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/shared/ui/Icon';
import clsx from 'clsx';
import styles from './Select.module.scss';

type SelectOption = {
  title: string;
  value: string;
  icon?: React.ReactNode;
};

type SelectPropsType = {
  className?: string;
  options: SelectOption[];
  value?: string | null;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  label?: string;
};

export const Select = ({
  options,
  value,
  placeholder,
  onChange,
  disabled,
  label,
  className,
}: SelectPropsType) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInside = rootRef.current?.contains(target);
      if (!clickedInside) setIsOpen(false);
    };

    document.addEventListener('click', handler);

    return () => document.removeEventListener('click', handler);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const selectedOption = options.find((o) => o.value === value);

  const selectedTitle = selectedOption ? selectedOption.title : placeholder;

  const selectValue = (value: string) => {
    if (disabled) return;
    setIsOpen(false);
    onChange?.(value);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;

      case 'Enter': {
        if (!isOpen) return;
        e.preventDefault();
        const option = options[activeIndex];
        if (option) selectValue(option.value);
        break;
      }

      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
    }
  };

  return (
    <div data-open={isOpen} className={clsx(styles.root, className)} ref={rootRef}>
      {label && <span className={`regular_text_14 ${styles.label_title}`}>{label}</span>}
      <button
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => handleKeyDown(e)}
        ref={buttonRef}
        disabled={disabled}
      >
        <span className={styles.value_wrapper}>
          {selectedOption?.icon && <span className={styles.icon}>{selectedOption.icon}</span>}
          <span className={`regular_text_16 ${styles.label}`}>{selectedTitle}</span>
        </span>
        <Icon className={styles.arrow} iconId={'arrow-ios-Down-outline'} />
      </button>

      {isOpen && (
        <ul className={styles.list} role="listbox">
          {options.map((o, i) => (
            <li
              className={`regular_text_16 ${styles.option}`}
              data-active={i === activeIndex}
              data-selected={o.value === value}
              role="option"
              aria-selected={o.value === value}
              key={o.value}
              onClick={() => selectValue(o.value)}
            >
              {o.icon && <span className={styles.icon}>{o.icon}</span>}
              {o.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
