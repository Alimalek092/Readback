import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Bookmark, CheckCircle2 } from 'lucide-react';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://readback-omega.vercel.app';

export const metadata: Metadata = {
  title: 'Book Highlight Manager for Physical Books, E-Readers & Notes',
  description:
    'How to unify highlights from physical paperbacks, e-readers, and audiobooks into one searchable personal knowledge library with ReadBack.',
  keywords: [
    'book highlight manager',
    'physical book notes app',
    'personal book library',
    'book notes organizer',
  ],
  alternates: { canonical: '/guides/book-highlight-manager' },
};

export default function BookHighlightManagerGuidePage() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Book Highlight Manager for Physical Books, E-Readers & Notes',
      description:
        'Unify highlights from physical books and digital reading into one searchable library.',
      author: { '@type': 'Organization', name: 'ReadBack' },
      publisher: { '@type': 'Organization', name: 'ReadBack' },
      mainEntityOfPage: `${BASE_URL}/guides/book-highlight-manager`,
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
          name: 'Book Highlight Manager',
          item: `${BASE_URL}/guides/book-highlight-manager`,
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
              One Book Highlight Manager for Physical & Digital Reading
            </h1>
            <p className="text-sm sm:text-base text-[#6B685F] leading-relaxed">
              Your best insights shouldn&apos;t stay trapped in underlined paperbacks or buried in phone screenshots. Bring every book into one quiet workspace.
            </p>
          </div>

          <section className="space-y-4 text-sm sm:text-base text-[#45433B] leading-relaxed">
            <h2 className="font-serif text-2xl text-[#292820]">
              Why Physical Book Readers Need a Digital Companion
            </h2>
            <p>
              Paper books offer unmatched focus, but they lack searchability. Six months after finishing a hardcover book, finding a specific paragraph you underlined means flipping through hundreds of pages.
            </p>
            <p>
              With ReadBack, you look up any title in seconds via Open Library, keep your reading progress updated, and capture key lessons with page numbers on your phone or laptop in under 10 seconds.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white border border-[#E9E5DC] space-y-3">
            <h3 className="font-serif text-xl text-[#292820] flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#74866B]" />
              <span>What Makes a Great Highlight Manager</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#56544D]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#74866B] mt-0.5 flex-shrink-0" />
                <span><strong>Fast Global Capture:</strong> Save an idea from any screen with one shortcut.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#74866B] mt-0.5 flex-shrink-0" />
                <span><strong>Cross-Book Search:</strong> Search across every book, tag, and personal reflection simultaneously.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#74866B] mt-0.5 flex-shrink-0" />
                <span><strong>Full Export Ownership:</strong> Download your entire library to Markdown or JSON anytime.</span>
              </li>
            </ul>
          </section>

          <div className="pt-8 border-t border-[#E9E5DC] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-serif text-xl text-[#292820]">Unify your reading notes today</h4>
              <p className="text-xs text-[#858276]">Free for up to 5 books and 50 saved ideas.</p>
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
