import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReadBack — Read less forgetfully. Learn more permanently.',
  description:
    'A personal knowledge companion that helps readers capture, organize, remember and apply lessons from the books they read using spaced repetition.',
  keywords: [
    'book notes',
    'spaced repetition for readers',
    'personal knowledge management',
    'reading journal',
    'remember what you read',
    'book highlights organizer',
  ],
  authors: [{ name: 'ReadBack Team' }],
  openGraph: {
    title: 'ReadBack — Personal Knowledge SaaS for Readers',
    description: "Don't just finish books. Remember what they teach you.",
    url: 'https://readback.app',
    siteName: 'ReadBack',
    locale: 'en_US',
    type: 'website',
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
