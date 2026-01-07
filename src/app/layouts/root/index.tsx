import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import '@/shared/styles/globals.scss';
import { Alert } from '@/shared/ui/Alert/Alert';

import { ModalWindow } from '@/shared/ui/ModalWindow';

import Script from 'next/script';
import { SvgSprite } from '@/shared/ui/SvgSprite';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-main',
});
export const metadata: Metadata = {
  title: 'FSD Next.js starter',
  description: 'Feature-Sliced scaffold with App Router re-exports.',
  icons: {
    icon: [
      {
        url: '/favicon-light.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/favicon-dark.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon.ico',
        type: 'image/x-icon',
      },
    ],
  },
};
export function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className={inter.variable} lang="en">
      <body>
        <Alert />
        <SvgSprite />
        <ModalWindow />
        {children}
        <Script
          src="https://www.google.com/recaptcha/api.js?render=explicit"
          strategy="afterInteractive"
        />
      </body>{' '}
    </html>
  );
}

export default RootLayout;
