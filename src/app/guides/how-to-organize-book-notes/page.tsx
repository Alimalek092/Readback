import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://readback-omega.vercel.app';

export const metadata: Metadata = {
  title: 'How to Organize Book Notes Without Overcomplicating Your System',
  description:
    'A minimal, editorial workflow to organize reading notes by book, concept tags, and personal reflections—without spending hours building complex templates.',
  keywords: [
    'book notes organizer',
    'organize reading notes',
    'personal book library',
    'reading notes app',
    'personal knowledge library',
  ],
  alternates: { canonical: '/guides/how-to-organize-book-notes' },
};

export default function OrganizeBookNotesGuidePage() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How to Organize Book Notes Without Overcomplicating Your System',
      description:
        'A minimal workflow for organizing book notes, quotes, and personal reflections.',
      author: { '@type': 'Organization', name: 'ReadBack' },
      publisher: { '@type': 'Organization', name: 'ReadBack' },
      mainEntityOfPage: `${BASE_URL}/guides/how-to-organize-book-notes`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: `${BASE_URL}/guides` },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'How to Organize Book Notes',
          item: `${BASE_URL}/guides/how-to-organize-book-notes`,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#292820] flex flex-col">
      <JsonLd data={schema} />
      <PublicNavbar />

      <main className="flex-1 py-16 md:py-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="border-b border-[#E9E5DC] pb-8">
            <Link href="/guides" className="text-xs font-semibold text-[#74866B] hover:underline">
              ← All Reading Guides
            </Link>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#292820] mt-4 mb-4 leading-tight">
              How to Organize Book Notes Without Overcomplicating Your System
            </h1>
            <p className="text-sm sm:text-base text-[#6B685F] leading-relaxed">
              The best book notes organizer is the one you actually open after a long day. Here is how to structure your reading journal for effortless retrieval.
            </p>
          </div>

          <section className="space-y-4 text-sm sm:text-base text-[#45433B] leading-relaxed">
            <h2 className="font-serif text-2xl text-[#292820]">
              Separate Quotes From Personal Reflections
            </h2>
            <p>
              When you copy a passage verbatim, you capture the author&apos;s words. When you add a one-sentence reflection on how that idea applies to your own work or habits, you create a memory hook. Keeping both together makes your notes immediately useful months later.
            </p>
          </section>

          <section className="space-y-4 text-sm sm:text-base text-[#45433B] leading-relaxed">
            <h2 className="font-serif text-2xl text-[#292820]">
              Use Broad Topic Tags Across Books
            </h2>
            <p>
              You often remember an insight about <em>Decision Making</em> or <em>Habits</em> long after you forget which book it came from. Using 2–3 reusable tags per note connects ideas across your entire library so you can search by concept rather than book title.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white border border-[#E9E5DC] space-y-3">
            <h3 className="font-serif text-xl text-[#292820] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#74866B]" />
              <span>5 Note Types That Cover 99% of Non-Fiction</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#56544D]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#74866B] mt-0.5 flex-shrink-0" />
                <span><strong>Important Lesson:</strong> Core principles and frameworks you want to internalize.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#74866B] mt-0.5 flex-shrink-0" />
                <span><strong>Quote:</strong> Memorable phrasing worth preserving word-for-word with page numbers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#74866B] mt-0.5 flex-shrink-0" />
                <span><strong>Actionable Idea:</strong> Concrete experiments or habits you plan to apply this week.</span>
              </li>
            </ul>
          </section>

          <div className="pt-8 border-t border-[#E9E5DC] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-serif text-xl text-[#292820]">Build a calm, searchable library</h4>
              <p className="text-xs text-[#858276]">Organize your books, notes, and actions in ReadBack.</p>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-xs font-semibold shadow-sm"
            >
              <span>Start Free Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}
