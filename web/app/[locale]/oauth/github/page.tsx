import { Suspense } from 'react';

import OAuthGithubPage, { metadata } from '@/pages/oauth/github';

export { metadata };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OAuthGithubPage />
    </Suspense>
  );
}
