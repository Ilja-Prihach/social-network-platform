import { RegistrationConfirmationHandler } from '@/features/auth/registration-confirmation';
import { HomePageClient } from './HomePageClient';

type HomePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const normalizeParam = (value?: string | string[]): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export function HomePage({ searchParams = {} }: HomePageProps) {
  const postId = normalizeParam(searchParams.postId);
  const action = normalizeParam(searchParams.action);
  const code = normalizeParam(searchParams.code);
  const email = normalizeParam(searchParams.email);

  return (
    <>
      <RegistrationConfirmationHandler code={code} email={email} />
      <HomePageClient postId={postId} action={action} />
    </>
  );
}
