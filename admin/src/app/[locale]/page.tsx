import { notFound, redirect } from 'next/navigation';
import { adminLocales } from '../../../intlayer.config';

type AdminLocaleRootPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminLocaleRootPage({ params }: AdminLocaleRootPageProps) {
  const { locale } = await params;

  if (!adminLocales.includes(locale as (typeof adminLocales)[number])) {
    notFound();
  }

  redirect(`/${locale}/sign-in`);
}
