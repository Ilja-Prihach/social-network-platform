import { withIntlayer } from 'next-intlayer/server'; // Add the plugin to the Next.js configuration
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

export default withIntlayer(nextConfig);
