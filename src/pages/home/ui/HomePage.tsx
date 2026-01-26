import { RegistrationConfirmationHandler } from '@/features/auth/registration-confirmation';
import { HomePageClient } from './HomePageClient';

type HomePageProps = {
  searchParams?:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
};

const normalizeParam = (value?: string | string[]): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const postId = normalizeParam(resolvedSearchParams.postId);
  const action = normalizeParam(resolvedSearchParams.action);
  const code = normalizeParam(resolvedSearchParams.code);
  const email = normalizeParam(resolvedSearchParams.email);

  return (
    <>
      <RegistrationConfirmationHandler code={code} email={email} />
      <HomePageClient postId={postId} action={action} />
    </>
  );
}
