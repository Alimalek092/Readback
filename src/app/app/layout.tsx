import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Library Workspace',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppPrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
