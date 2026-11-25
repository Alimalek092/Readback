import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Free Personal Library & ReadBack Plus',
  description:
    'Start your personal book knowledge library for free (up to 5 books and 50 ideas), or upgrade to ReadBack Plus for $2.99/month for unlimited books, spaced repetition, and exports.',
  alternates: { canonical: '/pricing' },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
