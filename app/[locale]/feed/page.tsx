import type { Metadata } from 'next';
import { HomeFeedRoutePage } from '../_shared/HomeFeedRoutePage';

export const metadata: Metadata = {
  title: 'Feed',
  description: 'Posts feed page',
};

export const revalidate = 60;
export default HomeFeedRoutePage;
