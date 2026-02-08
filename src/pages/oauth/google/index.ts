import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Google OAuth',
  description: 'Google OAuth callback page',
};

export { OAuthGooglePage as default } from './ui/OAuthGooglePage';
