import { Suspense } from 'react';
import { HomePage } from '@/pages/home/ui/HomePage';
import { IntlayerServerProvider } from 'next-intlayer/server';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return (
    <IntlayerServerProvider locale={locale}>
      <Suspense fallback={null}>
        <HomePage />
      </Suspense>
    </IntlayerServerProvider>
  );
}
