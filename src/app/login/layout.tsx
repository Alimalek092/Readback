import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In to Your Personal Knowledge Library',
  description:
    'Sign in to ReadBack with your email address to access your saved book notes, highlights, and daily spaced-repetition reviews.',
  alternates: { canonical: '/login' },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
