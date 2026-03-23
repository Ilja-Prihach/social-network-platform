import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MyProfileSettingsIndexPage({ params }: PageProps) {
  const { locale } = await params;
  redirect(`/${locale}/my-profile/settings/general-information`);
}
