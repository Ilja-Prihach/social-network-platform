import { Suspense } from 'react';
import { EmailVerificationWidget } from '@/widgets/auth/emailVerification';

export function PasswordRecoveryPage() {
  return (
    <Suspense fallback={<div />}>
      <EmailVerificationWidget variant="password-recovery" />
    </Suspense>
  );
}
