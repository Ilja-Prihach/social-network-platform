import { redirect } from 'next/navigation';

type AdminLocaleRootPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminLocaleRootPage({ params }: AdminLocaleRootPageProps) {
  const { locale } = await params;

  redirect(`/${locale}/sign-in`);
}
