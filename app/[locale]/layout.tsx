import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { getHTMLTextDir } from 'intlayer';
import '@/shared/styles/globals.scss';
import { getMeServerSafe } from '@/entities/user/api/me.server';
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
  const initialMe = await getMeServerSafe().catch(() => undefined);
  return (
    <IntlayerClientProvider locale={locale}>
      <div lang={locale} dir={getHTMLTextDir(locale)} className={inter.variable}>
        <AppShell initialMe={initialMe}>{children}</AppShell>
      </div>
    </IntlayerClientProvider>
  );
}
