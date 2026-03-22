'use client';

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

const SUPPORTED_LOCALES = new Set<LanguageCode>(LANGUAGE_OPTIONS.map((option) => option.value));

const joinClassNames = (...classNames: Array<string | undefined>) =>
  classNames.filter(Boolean).join(' ');

const getLocalizedPath = (pathname: string, locale: LanguageCode) => {
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] && SUPPORTED_LOCALES.has(segments[0] as LanguageCode)) {
    segments.shift();
  }

  const barePath = segments.length > 0 ? `/${segments.join('/')}` : '';

  return `/${locale}${barePath}`;
};

export function LanguageSelect({ onChange, disabled, className }: LanguageSelectProps) {
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname() ?? `/${locale}`;
  const value = (locale as LanguageCode) ?? 'en';

  const handleChange = (nextValue: LanguageCode) => {
    onChange?.(nextValue);
    const nextPath = getLocalizedPath(pathname || '/', nextValue);
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
