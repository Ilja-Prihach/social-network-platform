import { Suspense } from 'react';

import OAuthGooglePage, { metadata } from '@/pages/oauth/google';

export { metadata };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OAuthGooglePage />
    </Suspense>
  );
}
