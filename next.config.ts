import { withIntlayer } from 'next-intlayer/server'; // Add the plugin to the Next.js configuration
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'staging-it-incubator.s3.eu-central-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.yandexcloud.net',
        pathname: '/**',
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      'node:module': './src/shared/shims/nodeModule.ts',
      'node:fs': './src/shared/shims/nodeFs.ts',
      'node:fs/promises': './src/shared/shims/nodeFsPromises.ts',
    },
  },
};

export default withIntlayer(nextConfig);
