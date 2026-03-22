import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getHTMLTextDir } from 'intlayer';
import { IntlayerClientProvider } from 'next-intlayer';
import { AdminHeader } from '@/widgets/admin-header';
import { adminLocales } from '../../../intlayer.config';

export { generateStaticParams } from 'next-intlayer';

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!adminLocales.includes(locale as (typeof adminLocales)[number])) {
    notFound();
  }

  return (
    <IntlayerClientProvider locale={locale}>
      <div lang={locale} dir={getHTMLTextDir(locale)}>
        <AdminHeader />
        {children}
      </div>
    </IntlayerClientProvider>
  );
}
