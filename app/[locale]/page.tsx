import { HomePage } from '@/pages/home/ui/HomePage';
import { IntlayerServerProvider } from 'next-intlayer/server';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return (
    <IntlayerServerProvider locale={locale}>
      <HomePage />
    </IntlayerServerProvider>
  );
}
