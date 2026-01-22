import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { getHTMLTextDir } from 'intlayer';
import '@/shared/styles/globals.scss';

import { AppShell } from '@/app/providers/AppShell';
import { IntlayerClientProvider } from 'next-intlayer';

export { generateStaticParams } from 'next-intlayer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-main',
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const p = await params;
  const locale = p.locale;
  return (
    <html lang={locale} dir={getHTMLTextDir(locale)} className={inter.variable}>
      <body>
        <IntlayerClientProvider locale={locale}>
          <AppShell>{children}</AppShell>
        </IntlayerClientProvider>
      </body>
    </html>
  );
}
