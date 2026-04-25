import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' });

export const metadata: Metadata = {
  title: 'CodeQuest',
  description: 'Gamified interactive learning platform for coding.',
};

import { initAuth } from '@/lib/firebase';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initAuth();
  }, []);

  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="bg-slate-900 text-slate-200 font-sans min-h-screen selection:bg-violet-500/30">
        {/* Skip to main content - keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg focus:font-bold"
        >
          Skip to main content
        </a>
        <div id="main-content">
          {children}
        </div>
        <GoogleAnalytics gaId="G-H6E9PTLKRY" />
      </body>
    </html>
  );
}
