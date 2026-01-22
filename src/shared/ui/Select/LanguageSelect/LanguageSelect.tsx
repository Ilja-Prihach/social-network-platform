import { useState } from 'react';
import { Select } from '@/shared/ui/Select/Select';
import { Icon } from '@/shared/ui/Icon';
import styles from './LanguageSelect.module.scss';
import clsx from 'clsx';

type LanguageCode = 'en' | 'ru';

type LanguageSelectProps = {
  defaultValue?: LanguageCode;
  onChange?: (value: LanguageCode) => void; // стало опциональным
  disabled?: boolean;
  className?: string;
};

const LANGUAGE_OPTIONS = [
  {
    value: 'en',
    title: 'English',
    icon: <Icon iconId="Flag United Kingdom" width="20" height="20" />,
  },
  {
    value: 'ru',
    title: 'Russian',
    icon: <Icon iconId="Flag Russia" width="20" height="20" />,
  },
];

export const LanguageSelect = ({
  defaultValue = 'en',
  onChange,
  disabled,
  className,
}: LanguageSelectProps) => {
  const [value, setValue] = useState<LanguageCode>(defaultValue);

  const handleChange = (v: string) => {
    const lang = v as LanguageCode;
    setValue(lang);
    onChange?.(lang);
  };

  return (
    <Select
      className={clsx(styles.root, className)}
      options={LANGUAGE_OPTIONS}
      value={value}
      disabled={disabled}
      onChange={handleChange}
    />
  );
};
