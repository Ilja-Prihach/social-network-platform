import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Password reset page',
};

export { CreatePasswordPage as default } from './ui/CreatePasswordPage';
