import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/shared/ui/Icon';
import styles from './Select.module.scss';

type SelectOption = {
  title: string;
  value: string;
};

type SelectPropsType = {
  options: SelectOption[];
  value: string | null;
  placeholder: string;
  onChange: (value: string) => void;
};

export const Select = ({ options, value, placeholder, onChange }: SelectPropsType) => {
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

  const label = selectedOption ? selectedOption.title : placeholder;

  const selectValue = (value: string) => {
    setIsOpen(false);
    onChange?.(value);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
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
    <div data-open={isOpen} className={styles.root} ref={rootRef}>
      <button
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => handleKeyDown(e)}
        ref={buttonRef}
      >
        <span className={styles.label}>{label}</span>
        <Icon
          className={styles.arrow}
          iconId={'arrow-ios-Down-outline'}
          style={{ color: 'black' }}
        />
      </button>

      {isOpen && (
        <ul className={styles.list} role="listbox">
          {options.map((o, i) => (
            <li
              className={styles.option}
              data-active={i === activeIndex}
              data-selected={o.value === value}
              role="option"
              aria-selected={o.value === value}
              key={o.value}
              onClick={() => selectValue(o.value)}
            >
              {o.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
