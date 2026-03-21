import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email Verification',
  description: 'Resend email verification link',
};

export { EmailVerificationPage as default } from './ui/EmailVerificationPage';
