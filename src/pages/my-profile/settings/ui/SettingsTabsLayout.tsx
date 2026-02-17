'use client';

import Link from 'next/link';
import { getLocalizedUrl } from 'intlayer';
import { useLocale } from 'next-intlayer';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import styles from './SettingsTabsLayout.module.scss';

const tabs = [
  {
    href: '/my-profile/settings/general-information',
    label: 'General information',
  },
  {
    href: '/my-profile/settings/devices',
    label: 'Devices',
  },
  {
    href: '/my-profile/settings/account-management',
    label: 'Account Management',
  },
  {
    href: '/my-profile/settings/my-payments',
    label: 'My payments',
  },
] as const;

export function SettingsTabsLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { locale } = useLocale();

  return (
    <section className={styles.page}>
      <div className={styles.tabs_row}>
        {tabs.map((tab) => {
          const localizedHref = getLocalizedUrl(tab.href, locale);
          const isActive = pathname === localizedHref;

          return (
            <Link
              key={tab.href}
              href={localizedHref}
              className={`${styles.tab} ${isActive ? styles.tab_active : ''}`}
              title={tab.label}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </section>
  );
}
