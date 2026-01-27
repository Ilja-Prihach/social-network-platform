import { withIntlayer } from 'next-intlayer/server'; // Add the plugin to the Next.js configuration
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://socialnetwork-ai.com/api/v1/:path*',
      },
    ];
  },
};

export default withIntlayer(nextConfig);
