import { HomePage } from '@/pages/home/ui/HomePage';
import { IntlayerServerProvider } from 'next-intlayer/server';
import { getHomePageInitialData } from '@/pages/home/model/getHomePageInitialData';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 60;

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const { posts, peopleCount } = await getHomePageInitialData();

  return (
    <IntlayerServerProvider locale={locale}>
      <HomePage initialPosts={posts} initialPeopleCount={peopleCount} />
    </IntlayerServerProvider>
  );
}
