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

export default nextConfig;
