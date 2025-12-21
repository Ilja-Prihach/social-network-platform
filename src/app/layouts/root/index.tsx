import type { Metadata } from "next";
import {Inter} from "next/font/google";
import type { ReactNode } from "react";
import "@/app/styles/globals.scss";

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-main',
});



export const metadata: Metadata = {
  title: "FSD Next.js starter",
  description: "Feature-Sliced scaffold with App Router re-exports.",
};

export function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className={inter.variable} lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
