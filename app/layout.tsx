import { Analytics } from '@vercel/analytics/react';
import { Open_Sans } from 'next/font/google';
import { Footer } from './components/footer';
import { Header } from './components/header';
import './globals.css';

const open_sans = Open_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'OptimAIzer | AI-Powered Code Review & Debugging',
  description:
    'OptimAIzer is a SaaS platform for developers that provides AI-powered code review, debugging, and optimization using Retrieval-Augmented Generation (RAG).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={open_sans.className}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1"
        />
      </head>
      <body>
        <div>
          <Header />
          <main className="mb-16 overflow-hidden bg-page-gradient pt-[var(--navigation-height)]">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
