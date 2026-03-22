import type { ReactNode } from 'react';
import { getHTMLTextDir } from 'intlayer';
import { IntlayerClientProvider } from 'next-intlayer';
import { AdminHeader } from '@/widgets/admin-header';

export { generateStaticParams } from 'next-intlayer';

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <IntlayerClientProvider locale={locale}>
      <div lang={locale} dir={getHTMLTextDir(locale)}>
        <AdminHeader />
        {children}
      </div>
    </IntlayerClientProvider>
  );
}
