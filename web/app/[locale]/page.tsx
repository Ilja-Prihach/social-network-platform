import { HomeFeedRoutePage } from './_shared/HomeFeedRoutePage';

export const revalidate = 60;

export default function Page(props: Parameters<typeof HomeFeedRoutePage>[0]) {
  return <HomeFeedRoutePage {...props} mode="preview" />;
}
