import { withIntlayer } from 'next-intlayer/server';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },
};

export default withIntlayer(nextConfig);
