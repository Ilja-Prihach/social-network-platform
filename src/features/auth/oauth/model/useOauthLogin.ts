'use client';

import { useLocale } from 'next-intlayer';
import { showAlert } from '@/shared/ui/Alert';

const GOOGLE_SCOPE = 'openid email profile';
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_CLIENT_ID = '145458398677-b8ikea37rrcek37tvkf0o6qc3rks3fnu.apps.googleusercontent.com';

const buildRedirectUrl = (origin: string, locale: string, provider: 'github' | 'google') =>
  `${origin}/${locale}/oauth/${provider}`;

export const useOauthLogin = () => {
  const { locale } = useLocale();

  const startGithubLogin = () => {
    if (typeof window === 'undefined') return;
    const origin = window.location.origin;
    const redirectUrl = buildRedirectUrl(origin, locale, 'github');
    const url = `/api/v1/auth/github/login?redirect_url=${encodeURIComponent(redirectUrl)}`;
    window.location.assign(url);
  };

  const startGoogleLogin = () => {
    if (typeof window === 'undefined') return;
    if (!GOOGLE_CLIENT_ID) {
      showAlert('Google OAuth client ID is not configured.', 'error');
      return;
    }

    const origin = window.location.origin;
    const redirectUrl = buildRedirectUrl(origin, locale, 'google');
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUrl,
      response_type: 'code',
      scope: GOOGLE_SCOPE,
      access_type: 'offline',
      prompt: 'consent',
    });

    window.location.assign(`${GOOGLE_AUTH_URL}?${params.toString()}`);
  };

  return { startGithubLogin, startGoogleLogin };
};
