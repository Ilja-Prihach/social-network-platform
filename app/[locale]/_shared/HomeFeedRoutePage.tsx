import { IntlayerServerProvider } from 'next-intlayer/server';
import { HomePage } from '@/pages/home/ui/HomePage';
import { getHomePageInitialData } from '@/pages/home/model/getHomePageInitialData';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 60;

export async function HomeFeedRoutePage({ params }: PageProps) {
  const { locale } = await params;
  const { posts, nextCursorPostId, peopleCount } = await getHomePageInitialData();

  return (
    <IntlayerServerProvider locale={locale}>
      <HomePage
        initialPosts={posts}
        initialNextCursorPostId={nextCursorPostId}
        initialPeopleCount={peopleCount}
      />
    </IntlayerServerProvider>
  );
}
