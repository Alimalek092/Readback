import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Your Free Book Knowledge Library',
  description:
    'Join ReadBack for free. Capture important lessons from physical and digital books, organize highlights, and remember what you read forever.',
  alternates: { canonical: '/signup' },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
