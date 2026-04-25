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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="bg-slate-900 text-slate-200 font-sans min-h-screen selection:bg-violet-500/30">
        {children}
        <GoogleAnalytics gaId="G-H6E9PTLKRY" />
      </body>
    </html>
  );
}
