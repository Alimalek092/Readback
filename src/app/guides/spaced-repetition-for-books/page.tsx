import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://readback-omega.vercel.app';

export const metadata: Metadata = {
  title: 'Spaced Repetition for Books: How to Remember What You Read',
  description:
    'Learn how spaced repetition works for non-fiction books without making rigid flashcards. Revisit book lessons at optimal intervals and build permanent recall.',
  keywords: [
    'spaced repetition for books',
    'spaced repetition for book notes',
    'remember what you read',
    'remember book lessons',
    'knowledge retention app',
  ],
  alternates: { canonical: '/guides/spaced-repetition-for-books' },
};

export default function SpacedRepetitionGuidePage() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Spaced Repetition for Books: How to Remember What You Read',
      description:
        'A practical guide to using adaptive spaced repetition to remember lessons from non-fiction books.',
      author: { '@type': 'Organization', name: 'ReadBack' },
      publisher: { '@type': 'Organization', name: 'ReadBack' },
      mainEntityOfPage: `${BASE_URL}/guides/spaced-repetition-for-books`,
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
          name: 'Spaced Repetition for Books',
          item: `${BASE_URL}/guides/spaced-repetition-for-books`,
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
              Spaced Repetition for Books: How to Remember What You Read
            </h1>
            <p className="text-sm sm:text-base text-[#6B685F] leading-relaxed">
              You don&apos;t need to read faster. You need a calm system that brings the right book lesson back to your attention right before your brain forgets it.
            </p>
          </div>

          <section className="space-y-4 text-sm sm:text-base text-[#45433B] leading-relaxed">
            <h2 className="font-serif text-2xl text-[#292820]">Why We Forget Great Books</h2>
            <p>
              Psychologist Hermann Ebbinghaus demonstrated that human memory decays exponentially after initial exposure—known as the forgetting curve. When you finish a 300-page book on psychology, finance, or leadership and move immediately to the next title, most of the nuanced insights fade within two weeks.
            </p>
            <p>
              Highlighting a sentence feels productive in the moment, but a highlight you never revisit is indistinguishable from a highlight you never made.
            </p>
          </section>

          <section className="space-y-4 text-sm sm:text-base text-[#45433B] leading-relaxed">
            <h2 className="font-serif text-2xl text-[#292820]">
              Why Traditional Flashcard Apps Fail Readers
            </h2>
            <p>
              Traditional spaced-repetition tools were built for memorizing vocabulary or medical exam facts through rigid question-and-answer pairs. Forcing every meaningful book quote into a synthetic quiz feels robotic and kills the joy of reading.
            </p>
            <p>
              ReadBack takes a gentler approach: you save a natural <strong>Lesson</strong>, <strong>Quote</strong>, or <strong>Personal Reflection</strong> in under 10 seconds, and ReadBack schedules it into your <em>Remember Today</em> queue.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white border border-[#E9E5DC] space-y-3">
            <h3 className="font-serif text-xl text-[#292820] flex items-center gap-2">
              <RotateCw className="w-5 h-5 text-[#74866B]" />
              <span>The 3-Minute Daily Recall Loop</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#56544D]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#74866B] mt-0.5 flex-shrink-0" />
                <span><strong>Forgot</strong>: Reschedules the idea for your next session so it gets reinforced immediately.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#74866B] mt-0.5 flex-shrink-0" />
                <span><strong>Difficult</strong>: Brings the idea back tomorrow to strengthen recall.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#74866B] mt-0.5 flex-shrink-0" />
                <span><strong>Easy</strong>: Expands the interval (3 days → 7 days → weeks) so mastered lessons stay out of your way.</span>
              </li>
            </ul>
          </section>

          <div className="pt-8 border-t border-[#E9E5DC] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-serif text-xl text-[#292820]">Ready to remember your next book?</h4>
              <p className="text-xs text-[#858276]">Start your free personal knowledge library in 30 seconds.</p>
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
