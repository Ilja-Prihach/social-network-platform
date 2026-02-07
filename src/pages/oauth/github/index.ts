import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GitHub OAuth',
  description: 'GitHub OAuth callback page',
};

export { OAuthGithubPage as default } from './ui/OAuthGithubPage';
