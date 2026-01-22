'use client';

import type { PropsWithChildren } from 'react';
import { ReactQueryProvider } from '@/app/providers/ReactQueryProvider';
import { Alert } from '@/shared/ui/Alert/Alert';
import { SvgSprite } from '@/shared/ui/SvgSprite';
import { ModalWindow } from '@/shared/ui/ModalWindow';
import Script from 'next/script';

export const AppShell = ({ children }: PropsWithChildren) => (
  <ReactQueryProvider>
    <Alert />
    <SvgSprite />
    <ModalWindow />
    {children}
    <Script
      src="https://www.google.com/recaptcha/api.js?render=explicit"
      strategy="afterInteractive"
    />
  </ReactQueryProvider>
);
