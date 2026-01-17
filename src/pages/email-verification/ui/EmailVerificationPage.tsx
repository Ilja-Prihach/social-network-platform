import { Suspense } from 'react';
import { EmailVerificationWidget } from '@/widgets/auth/emailVerification';

export function EmailVerificationPage() {
  return (
    <Suspense fallback={<div />}>
      <EmailVerificationWidget variant="sign-up" />
    </Suspense>
  );
}
