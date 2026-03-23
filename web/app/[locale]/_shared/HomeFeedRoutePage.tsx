import { IntlayerServerProvider } from 'next-intlayer/server';
import { HomePage } from '@/pages/home/ui/HomePage';
import { getHomePageInitialData } from '@/pages/home/model/getHomePageInitialData';
import { HOME_FEED_INITIAL_PAGE_SIZE, HOME_PREVIEW_PAGE_SIZE } from '@/shared/config/pagination';

type HomeFeedRoutePageProps = {
  params: Promise<{ locale: string }>;
  mode?: 'preview' | 'feed';
};

export const revalidate = 60;

export async function HomeFeedRoutePage({ params, mode = 'preview' }: HomeFeedRoutePageProps) {
  const { locale } = await params;
  const pageSize = mode === 'feed' ? HOME_FEED_INITIAL_PAGE_SIZE : HOME_PREVIEW_PAGE_SIZE;
  const { posts, nextCursorPostId, peopleCount } = await getHomePageInitialData(pageSize);

  return (
    <IntlayerServerProvider locale={locale}>
      <HomePage
        mode={mode}
        initialPosts={posts}
        initialNextCursorPostId={nextCursorPostId}
        initialPeopleCount={peopleCount}
      />
    </IntlayerServerProvider>
  );
}
