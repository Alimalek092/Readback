import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://readback-omega.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'ReadBack — Remember What You Read | Personal Knowledge Library',
    template: '%s | ReadBack',
  },
  description:
    'ReadBack helps you capture book lessons, organize reading highlights, and remember what you read permanently with daily spaced repetition.',
  keywords: [
    'remember what you read',
    'book notes organizer',
    'spaced repetition for book notes',
    'book highlight manager',
    'personal book library',
    'reading notes app',
    'knowledge retention app',
    'personal knowledge library',
    'organize reading notes',
    'remember book lessons',
  ],
  authors: [{ name: 'ReadBack' }],
  creator: 'ReadBack',
  publisher: 'ReadBack',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ReadBack — Read less forgetfully. Learn more permanently.',
    description:
      "Don't just finish books. Remember what they teach you. Capture book ideas, organize highlights, and revisit lessons with spaced repetition.",
    url: BASE_URL,
    siteName: 'ReadBack',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReadBack — Remember What You Read',
    description:
      'Capture meaningful ideas from your books, organize your knowledge, and remember them forever with daily spaced repetition.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
