'use client';

import Link from 'next/link';
import { getLocalizedUrl } from 'intlayer';
import { useDictionary } from 'next-intlayer';
import { useLocale } from 'next-intlayer';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import settingsTabsContent from '../settings-tabs.content';
import styles from './SettingsTabsLayout.module.scss';

export function SettingsTabsLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { locale } = useLocale();
  const content = useDictionary(settingsTabsContent);

  const tabs = [
    {
      href: '/my-profile/settings/general-information',
      label: content.generalInformation,
    },
    {
      href: '/my-profile/settings/devices',
      label: content.device,
    },
    {
      href: '/my-profile/settings/account-management',
      label: content.accountManagement,
    },
    {
      href: '/my-profile/settings/my-payments',
      label: content.myPayments,
    },
  ] as const;

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
