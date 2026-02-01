import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Recovery',
  description: 'Resend password recovery link',
};

export { PasswordRecoveryPage as default } from './ui/PasswordRecoveryPage';
