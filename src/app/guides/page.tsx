import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, RotateCw, Layers, Bookmark } from 'lucide-react';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://readback-omega.vercel.app';

export const metadata: Metadata = {
  title: 'Reading Retention Guides — Remember What You Read',
  description:
    'Practical guides on spaced repetition for books, organizing reading notes, and building a lifelong personal knowledge library.',
  alternates: { canonical: '/guides' },
};

const guides = [
  {
    href: '/guides/spaced-repetition-for-books',
    title: 'Spaced Repetition for Books: How to Remember What You Read',
    description:
      'Why the forgetting curve erases 80% of non-fiction insights within a week—and how a 5-minute daily review habit makes book lessons permanent.',
    tag: 'Memory & Retention',
    icon: RotateCw,
    readTime: '5 min read',
  },
  {
    href: '/guides/how-to-organize-book-notes',
    title: 'How to Organize Book Notes Without Building a Complicated System',
    description:
      'A calm, practical workflow for capturing quotes, tagging mental models across books, and turning passive highlights into personal reflections.',
    tag: 'Knowledge Organization',
    icon: Layers,
    readTime: '6 min read',
  },
  {
    href: '/guides/book-highlight-manager',
    title: 'Choosing a Book Highlight Manager for Physical & Digital Books',
    description:
      'Stop leaving your best ideas scattered across paper margins, screenshots, and e-readers. How to unify every book lesson in one searchable sanctuary.',
    tag: 'Workflow & Tools',
    icon: Bookmark,
    readTime: '4 min read',
  },
];

export default function GuidesHubPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'ReadBack Reading Retention Guides',
    url: `${BASE_URL}/guides`,
    description:
      'Editorial guides on retaining non-fiction wisdom, organizing book notes, and applying spaced repetition to reading.',
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#292820] flex flex-col">
      <JsonLd data={schema} />
      <PublicNavbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#74866B] mb-2 block">
              ReadBack Editorial Guides
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#292820] mb-4">
              Read Less Forgetfully.
            </h1>
            <p className="text-sm sm:text-base text-[#6B685F] max-w-2xl mx-auto leading-relaxed">
              Evidence-backed methods for capturing ideas from physical and digital books, organizing your personal library, and remembering what matters.
            </p>
          </div>

          <div className="space-y-6">
            {guides.map((g) => {
              const Icon = g.icon;
              return (
                <Link
                  key={g.href}
                  href={g.href}
                  className="block bg-white rounded-2xl border border-[#E9E5DC] p-6 sm:p-8 shadow-subtle hover:border-[#74866B] transition-all group"
                >
                  <div className="flex items-center justify-between text-xs text-[#858276] mb-3">
                    <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[#74866B]">
                      <Icon className="w-3.5 h-3.5" />
                      {g.tag}
                    </span>
                    <span>{g.readTime}</span>
                  </div>
                  <h2 className="font-serif text-2xl text-[#292820] group-hover:text-[#74866B] transition-colors mb-2">
                    {g.title}
                  </h2>
                  <p className="text-sm text-[#6B685F] leading-relaxed mb-4">
                    {g.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74866B]">
                    <span>Read guide</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 p-8 rounded-2xl bg-[#E7EDE2]/70 border border-[#74866B]/20 text-center">
            <BookOpen className="w-7 h-7 text-[#74866B] mx-auto mb-3" />
            <h3 className="font-serif text-2xl text-[#292820] mb-2">
              Put these ideas into practice today
            </h3>
            <p className="text-xs sm:text-sm text-[#56544D] max-w-md mx-auto mb-5">
              Start your free personal knowledge library on ReadBack and capture your first book lesson in under 10 seconds.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-xs font-semibold shadow-sm"
            >
              <span>Start Free Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
