import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/shared/ui/Icon';

type SelectOption = {
  title: string;
  value: string;
};

type SelectPropsType = {
  options: SelectOption[];
  defaultValue?: string;
  placeholder: string;
  onChange?: (value: string) => void;
};

export const Select = ({ options, defaultValue, placeholder, onChange }: SelectPropsType) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState<string | null>(defaultValue ?? null);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInside = rootRef.current?.contains(target);
      if (!clickedInside) setIsOpen(false);
    };

    document.removeEventListener('click', handler);

    return () => document.addEventListener('click', handler);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.removeEventListener('keydown', onKeyDown);

    return () => document.addEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const selectedOption = options.find((o) => o.value === value);

  const label = selectedOption ? selectedOption.title : placeholder;

  const selectValue = (value: string) => {
    setValue(value);
    setIsOpen(false);
    onChange?.(value);
  };

  return (
    <div ref={rootRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        {label} <Icon iconId={'arrow-ios-Down-outline'} style={{ color: 'black' }} />
      </button>

      {isOpen && (
        <ul>
          {options.map((o) => (
            <li key={o.value} onClick={() => selectValue(o.value)}>
              {o.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
