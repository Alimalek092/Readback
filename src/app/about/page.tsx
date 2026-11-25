import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';

export const metadata: Metadata = {
  title: 'About ReadBack — Why We Built a Knowledge Retention App for Readers',
  description:
    'Learn the philosophy behind ReadBack: why passive reading fades, how spaced repetition helps you remember book lessons, and our reader-first privacy commitment.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#292820] flex flex-col">
      <PublicNavbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#74866B] mb-2 block">
              Our Mission & Philosophy
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#292820] mb-6">
              Why We Built ReadBack
            </h1>
            <p className="text-base text-[#6B685F] leading-relaxed max-w-xl mx-auto">
              Reading without retaining is like collecting seeds you never plant. We built ReadBack to fix the leaky bucket of self-education.
            </p>
          </div>

          <div className="prose prose-stone max-w-none space-y-6 text-[#45433B] leading-relaxed text-sm sm:text-base">
            <h3 className="font-serif text-2xl text-[#292820]">
              The Problem with Reading Trackers
            </h3>
            <p>
              Traditional reading apps obsess over vanity numbers: <em>"How many books did you finish this year?"</em> They turn reading into an athletic competition. Readers rush through pages just to mark a checkbox, yet six months later, they struggle to articulate a single lesson from those pages.
            </p>
            <p>
              We believe <strong>one deeply understood and applied idea is worth more than fifty forgotten books</strong>.
            </p>

            <div className="p-6 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] my-8">
              <h4 className="font-serif text-lg text-[#292820] mb-2">
                The ReadBack Promise
              </h4>
              <p className="text-xs sm:text-sm text-[#6B685F] italic mb-0">
                "We do not measure your worth by reading speed. We give you a quiet, warm sanctuary to preserve the ideas that alter how you think, decide, lead, and live."
              </p>
            </div>

            <h3 className="font-serif text-2xl text-[#292820]">
              The Power of Spaced Repetition for Non-Fiction
            </h3>
            <p>
              Medical students and polyglots have relied on spaced repetition for decades. But until now, no one built a reading journal that combined the elegance of a hardcover Moleskine notebook with the cognitive power of spaced repetition.
            </p>
            <p>
              In ReadBack, you capture an idea in 10 seconds. You don't have to build complex database templates or craft artificial flashcards. ReadBack schedules that thought to reappear right before your brain forgets it, gently weaving the author's wisdom into your long-term mental models.
            </p>

            <h3 className="font-serif text-2xl text-[#292820]">
              Our Reader-First Principles
            </h3>
            <ul className="space-y-3 pl-0 list-none">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#74866B] flex-shrink-0 mt-0.5" />
                <span><strong>Zero Dark Patterns:</strong> Cancel in one click. No hidden upsells or guilt-inducing streak warnings.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#74866B] flex-shrink-0 mt-0.5" />
                <span><strong>Absolute Data Ownership:</strong> Export your knowledge to Markdown or JSON whenever you wish.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#74866B] flex-shrink-0 mt-0.5" />
                <span><strong>No Data Selling:</strong> Your notes and reflections are strictly private and never monetized.</span>
              </li>
            </ul>
          </div>

          <div className="mt-16 pt-10 border-t border-[#E9E5DC] text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white font-medium text-sm shadow-sm transition-all"
            >
              <span>Start your personal library</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
