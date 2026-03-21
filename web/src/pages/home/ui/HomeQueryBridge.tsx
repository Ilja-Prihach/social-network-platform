'use client';

import { useSearchParams } from 'next/navigation';
import { RegistrationConfirmationHandler } from '@/features/auth/registration-confirmation';

export function HomeQueryBridge() {
  const searchParams = useSearchParams();
  const code = searchParams?.get('code') ?? undefined;
  const email = searchParams?.get('email') ?? undefined;

  return <RegistrationConfirmationHandler code={code} email={email} />;
}
