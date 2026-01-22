import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Network',
  description: 'Social Network AI',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return children;
}
