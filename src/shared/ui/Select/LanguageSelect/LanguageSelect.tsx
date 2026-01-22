import { Select } from '@/shared/ui/Select/Select';
import { Icon } from '@/shared/ui/Icon';
import styles from './LanguageSelect.module.scss';
import clsx from 'clsx';
import { useLocale } from 'next-intlayer';
import { usePathname, useRouter } from 'next/navigation';

type LanguageCode = 'en' | 'ru' | 'it' | 'es' | 'fr';

type LanguageSelectProps = {
  onChange?: (value: LanguageCode) => void;
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
  {
    value: 'it',
    title: 'Italian',
    icon: <Icon iconId="Flag Italy" width="20" height="20" />,
  },
  {
    value: 'es',
    title: 'Spanish',
    icon: <Icon iconId="Flag Spain" width="20" height="20" />,
  },
  {
    value: 'fr',
    title: 'French',
    icon: <Icon iconId="Flag France" width="20" height="20" />,
  },
];

export const LanguageSelect = ({ disabled, className, onChange }: LanguageSelectProps) => {
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname() ?? `/${locale}`;

  const value = (locale as LanguageCode) ?? 'en';

  const handleChange = (nextValue: string) => {
    const nextLang = nextValue as LanguageCode;

    onChange?.(nextLang);

    // '/en/feed' -> '/fr/feed'
    const parts = pathname.split('/');
    if (parts.length > 1) {
      parts[1] = nextLang;
    }

    const nextPath = parts.join('/') || `/${nextLang}`;

    router.push(nextPath);
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
