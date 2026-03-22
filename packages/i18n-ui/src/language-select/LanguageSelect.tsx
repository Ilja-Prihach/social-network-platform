'use client';

import { getLocalizedUrl } from 'intlayer';
import { useLocale } from 'next-intlayer';
import { usePathname, useRouter } from 'next/navigation';
import { Select } from '../select';
import styles from './LanguageSelect.module.scss';

type LanguageCode = 'en' | 'ru' | 'it' | 'es' | 'fr' | 'he';

type LanguageSelectProps = {
  onChange?: (value: LanguageCode) => void;
  disabled?: boolean;
  className?: string;
};

const LANGUAGE_OPTIONS: Array<{
  value: LanguageCode;
  title: string;
  icon: string;
}> = [
  { value: 'en', title: 'English', icon: '🇬🇧' },
  { value: 'ru', title: 'Russian', icon: '🇷🇺' },
  { value: 'it', title: 'Italian', icon: '🇮🇹' },
  { value: 'es', title: 'Spanish', icon: '🇪🇸' },
  { value: 'fr', title: 'French', icon: '🇫🇷' },
  { value: 'he', title: 'Hebrew', icon: '🇮🇱' },
];

const joinClassNames = (...classNames: Array<string | undefined>) =>
  classNames.filter(Boolean).join(' ');

export function LanguageSelect({ onChange, disabled, className }: LanguageSelectProps) {
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname() ?? `/${locale}`;
  const value = (locale as LanguageCode) ?? 'en';

  const handleChange = (nextValue: LanguageCode) => {
    onChange?.(nextValue);
    const nextPath = getLocalizedUrl(pathname || '/', nextValue);
    router.push(nextPath, { scroll: false });
  };

  return (
    <Select
      className={joinClassNames(styles.root, className)}
      options={LANGUAGE_OPTIONS}
      value={value}
      disabled={disabled}
      onChange={handleChange}
    />
  );
}
