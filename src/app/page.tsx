import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  RotateCw,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Layers,
  Search,
  Brain,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { JsonLd } from '@/components/JsonLd';
import { PRICING_PLANS } from '@/lib/subscription';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://readback-omega.vercel.app';

export default function LandingPage() {
  const loopSteps = [
    {
      num: '01',
      title: 'Read',
      desc: 'Read your favorite non-fiction, philosophy, or biography in print, Kindle, or audio.',
      icon: BookOpen,
    },
    {
      num: '02',
      title: 'Capture',
      desc: 'In under 10 seconds, save the one sentence or lesson that struck a chord.',
      icon: Bookmark,
    },
    {
      num: '03',
      title: 'Organize',
      desc: 'Group ideas by book, concept, and tags like Leadership, Psychology, or Habits.',
      icon: Layers,
    },
    {
      num: '04',
      title: 'Remember',
      desc: 'Spaced repetition brings back forgotten wisdom right before it slips away.',
      icon: RotateCw,
    },
    {
      num: '05',
      title: 'Apply',
      desc: 'Turn principles into weekly commitments, reflections, and tangible life choices.',
      icon: CheckCircle2,
    },
  ];

  const problems = [
    {
      title: 'Lessons vanish into the forgetting curve',
      desc: 'Within 7 days of finishing a great book, human recall drops below 20%. The golden insights you underlined are lost to daily noise.',
      icon: Clock,
    },
    {
      title: 'Notes & screenshots scattered everywhere',
      desc: 'Some highlights live on Kindle, some in a paper journal, some in camera rolls. None are easily searchable or linked to actionable habits.',
      icon: Compass,
    },
    {
      title: 'Passive reading gives the illusion of learning',
      desc: 'Finishing 50 books a year means nothing if your decisions and mindset remain identical. Retention requires deliberate, peaceful recall.',
      icon: Brain,
    },
  ];

  const faqs = [
    {
      q: 'What is ReadBack?',
      a: 'ReadBack is a quiet, personal knowledge companion designed for readers who want to retain, organize, and apply the best lessons from the books they read.',
    },
    {
      q: 'Is ReadBack an e-reader app like Kindle?',
      a: 'No. ReadBack is not for reading entire books. It is your permanent personal library where you store, revisit, and remember the key ideas, quotes, and reflections from any book you read in any format (print, digital, or audio).',
    },
    {
      q: 'Can I add physical books to my library?',
      a: 'Yes! You can search any title or author via our Open Library integration, or enter details manually. You can record page numbers and chapter references from physical copies effortlessly.',
    },
    {
      q: 'How does the spaced-repetition review work?',
      a: "Every saved idea is scheduled into your 'Remember Today' deck. When you review an idea and mark it as Forgot, Difficult, or Easy, our adaptive algorithm schedules its next review at the ideal moment to build long-term memory.",
    },
    {
      q: 'Is there a free plan?',
      a: 'Yes. Our Free Library plan includes up to 5 books and 50 saved ideas with daily review, search, and reading statistics forever. ReadBack Plus unlocks unlimited books, tags, and export options.',
    },
    {
      q: 'Can I export my notes and data?',
      a: 'Absolutely. You can export your entire knowledge repository at any time to clean Markdown files (ready for Obsidian/Notion) or raw JSON.',
    },
    {
      q: 'Do you sell my reading data or use my private notes for AI training?',
      a: 'Never. Your personal library, private highlights, and reflections are strictly yours. We do not sell user data or expose your notes to any third parties.',
    },
    {
      q: 'Does it work smoothly on mobile?',
      a: 'Yes. ReadBack is built from the ground up for mobile browsers with quick-capture shortcuts, touch-friendly review cards, and offline responsiveness.',
    },
  ];

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'ReadBack',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      url: BASE_URL,
      description:
        'A personal knowledge companion that helps readers capture, organize, remember, and apply lessons from the books they read using spaced repetition.',
      offers: [
        {
          '@type': 'Offer',
          name: 'Free Library',
          price: '0',
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          name: 'ReadBack Plus Monthly',
          price: '2.99',
          priceCurrency: 'USD',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ReadBack',
      url: BASE_URL,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#292820] flex flex-col">
      <JsonLd data={structuredData} />
      <PublicNavbar />

      {/* Hero Section */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#E9E5DC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E7EDE2] border border-[#74866B]/20 text-[#475A40] text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#74866B]" />
            <span>Read less forgetfully. Learn more permanently.</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#292820] max-w-3xl mx-auto leading-[1.15] mb-6">
            Don't just finish books. <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#74866B]">
              Remember what they teach you.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#6B685F] max-w-2xl mx-auto leading-relaxed mb-10">
            ReadBack helps you capture meaningful ideas, revisit what you've learned, and turn the knowledge from your books into something you actually remember and live by.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 py-3.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white font-medium text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Start building your knowledge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto px-6 py-3.5 rounded-button bg-white border border-[#E9E5DC] text-[#292820] hover:bg-[#F1EEE6] font-medium text-sm transition-all"
            >
              See how the loop works
            </Link>
          </div>

          {/* Hero Realistic Product Preview */}
          <div className="relative mx-auto max-w-4xl rounded-2xl p-2 sm:p-4 bg-[#F1EEE6] border border-[#E9E5DC] shadow-card">
            <div className="bg-white rounded-xl border border-[#E9E5DC] p-5 sm:p-8 text-left shadow-sm">
              {/* Fake App Header Preview */}
              <div className="flex items-center justify-between pb-6 border-b border-[#E9E5DC] mb-6">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#292820]">
                    Good morning, Arthur.
                  </h3>
                  <p className="text-xs text-[#858276]">
                    Wednesday, November 4 • 3 ideas scheduled for review today
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7EDE2] text-[#475A40] text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#74866B]" />
                    7 Day Streak
                  </span>
                </div>
              </div>

              {/* Remember Today Spotlight Card */}
              <div className="p-5 sm:p-6 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] mb-6 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-[#858276] mb-3">
                  <span className="font-semibold uppercase tracking-wider text-[#74866B] flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5" /> Remember Today
                  </span>
                  <span>From: Atomic Habits by James Clear</span>
                </div>
                <h4 className="font-serif text-lg sm:text-xl text-[#292820] mb-2 leading-snug">
                  "You do not rise to the level of your goals. You fall to the level of your systems."
                </h4>
                <p className="text-xs text-[#6B685F] italic mb-4">
                  Personal reflection: Focus less on quarterly goals and more on standardizing the first 5 minutes of morning work.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[#E9E5DC]/80">
                  <div className="flex gap-1.5">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-white border border-[#E9E5DC] text-[#858276]">
                      #Habits
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-white border border-[#E9E5DC] text-[#858276]">
                      #Systems
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 text-xs rounded-md bg-white border border-[#E9E5DC] text-[#292820]">
                      Forgot
                    </span>
                    <span className="px-3 py-1 text-xs rounded-md bg-white border border-[#E9E5DC] text-[#292820]">
                      Difficult
                    </span>
                    <span className="px-3 py-1 text-xs rounded-md bg-[#74866B] text-white font-medium">
                      Easy (Next: 7 days)
                    </span>
                  </div>
                </div>
              </div>

              {/* Realistic stats preview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-[#F8F6F0] border border-[#E9E5DC]">
                  <p className="text-[11px] text-[#858276] uppercase tracking-wider">Books in Library</p>
                  <p className="text-lg font-semibold text-[#292820] num-tabular">5</p>
                </div>
                <div className="p-3 rounded-lg bg-[#F8F6F0] border border-[#E9E5DC]">
                  <p className="text-[11px] text-[#858276] uppercase tracking-wider">Ideas Saved</p>
                  <p className="text-lg font-semibold text-[#292820] num-tabular">24</p>
                </div>
                <div className="p-3 rounded-lg bg-[#F8F6F0] border border-[#E9E5DC]">
                  <p className="text-[11px] text-[#858276] uppercase tracking-wider">Ideas Reviewed</p>
                  <p className="text-lg font-semibold text-[#292820] num-tabular">87</p>
                </div>
                <div className="p-3 rounded-lg bg-[#F8F6F0] border border-[#E9E5DC]">
                  <p className="text-[11px] text-[#858276] uppercase tracking-wider">Recall Retention</p>
                  <p className="text-lg font-semibold text-[#74866B] num-tabular">94%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — The Problem */}
      <section className="py-20 bg-[#F1EEE6]/60 border-b border-[#E9E5DC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#292820] mb-4">
              You read it. You loved it. <br />
              <span className="italic">But do you still remember it?</span>
            </h2>
            <p className="text-sm sm:text-base text-[#6B685F] leading-relaxed">
              Most readers suffer from passive consumption. Highlighting a book feels productive, but without revisiting those ideas, they slip away within days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((prob, i) => {
              const Icon = prob.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 border border-[#E9E5DC] shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#F8F6F0] border border-[#E9E5DC] flex items-center justify-center text-[#74866B] mb-5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#292820] mb-2">
                      {prob.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B685F] leading-relaxed">
                      {prob.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3 — The 5-Step Loop */}
      <section id="how-it-works" className="py-20 border-b border-[#E9E5DC] bg-[#F8F6F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#74866B] mb-2 block">
              The ReadBack Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#292820] mb-4">
              The 5-Step Learning Loop
            </h2>
            <p className="text-sm sm:text-base text-[#6B685F] leading-relaxed">
              ReadBack is not a complex productivity workspace. It is a quiet, natural loop designed to turn reading into permanent personal wisdom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {loopSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 border border-[#E9E5DC] shadow-sm relative flex flex-col justify-between group hover:border-[#74866B] transition-colors"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-[#74866B] mb-3 block">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-md bg-[#E7EDE2] text-[#475A40] flex items-center justify-center mb-4">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-[#292820] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#6B685F] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4 — Feature Showcase */}
      <section id="features" className="py-20 border-b border-[#E9E5DC] bg-[#F1EEE6]/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#292820] mb-3">
              Built for Lifelong Readers
            </h2>
            <p className="text-sm sm:text-base text-[#6B685F]">
              Every detail is crafted to provide a calm, distraction-free reading journal experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#E9E5DC] shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[#E7EDE2] text-[#74866B] flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#292820] mb-2">
                Personal Bookshelf
              </h3>
              <p className="text-xs text-[#6B685F] leading-relaxed">
                Add books via Open Library metadata or manual entry. Track reading status, progress percentages, and see every note clustered by book.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E9E5DC] shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[#E7EDE2] text-[#74866B] flex items-center justify-center mb-4">
                <RotateCw className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#292820] mb-2">
                Daily Spaced Repetition
              </h3>
              <p className="text-xs text-[#6B685F] leading-relaxed">
                Our adaptive SM-2 algorithm serves 3-5 cards each morning. Test your memory, rate difficulty, and watch key principles solidify.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E9E5DC] shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[#E7EDE2] text-[#74866B] flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#292820] mb-2">
                Unified Knowledge Search
              </h3>
              <p className="text-xs text-[#6B685F] leading-relaxed">
                Remember a great idea about 'Compounding' or 'Focus' but forgot which book it came from? Find it instantly across all your saved notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 — Pricing Preview */}
      <section className="py-20 border-b border-[#E9E5DC] bg-[#F8F6F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#292820] mb-3">
              Simple, Honest Pricing
            </h2>
            <p className="text-sm sm:text-base text-[#6B685F]">
              Start with our full-featured free plan. Upgrade to Plus when you're ready to make ReadBack your lifelong library.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl border border-[#E9E5DC] p-7 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#858276]">
                  {PRICING_PLANS.free.name}
                </span>
                <div className="mt-3 mb-2 flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-bold text-[#292820]">$0</span>
                  <span className="text-xs text-[#858276]">/ forever</span>
                </div>
                <p className="text-xs text-[#6B685F] mb-6">
                  {PRICING_PLANS.free.tagline}
                </p>
                <div className="space-y-3 mb-8">
                  {PRICING_PLANS.free.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-[#56544D]">
                      <CheckCircle2 className="w-4 h-4 text-[#74866B] flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link
                href="/signup"
                className="w-full text-center py-2.5 rounded-button border border-[#E9E5DC] hover:bg-[#F1EEE6] text-[#292820] text-sm font-medium transition-colors"
              >
                Start Free Library
              </Link>
            </div>

            {/* Plus Plan */}
            <div className="bg-[#FAF8F5] rounded-2xl border-2 border-[#74866B] p-7 shadow-card flex flex-col justify-between relative">
              <span className="absolute -top-3 right-6 bg-[#74866B] text-white text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold">
                Most Popular
              </span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#74866B]">
                  {PRICING_PLANS.plus_monthly.name}
                </span>
                <div className="mt-3 mb-2 flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-bold text-[#292820]">$2.99</span>
                  <span className="text-xs text-[#858276]">/ month (or $24.99/year)</span>
                </div>
                <p className="text-xs text-[#6B685F] mb-6">
                  {PRICING_PLANS.plus_monthly.tagline}
                </p>
                <div className="space-y-3 mb-8">
                  {PRICING_PLANS.plus_monthly.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-[#292820] font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#74866B] flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link
                href="/pricing"
                className="w-full text-center py-2.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-sm font-medium shadow-sm transition-colors"
              >
                View Pricing & Upgrade
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7 — FAQ */}
      <section className="py-20 border-b border-[#E9E5DC] bg-[#F1EEE6]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#292820] mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#6B685F]">
              Everything you need to know about ReadBack and how it handles your reading data.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 border border-[#E9E5DC] shadow-sm"
              >
                <h4 className="font-serif text-base font-semibold text-[#292820] mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#74866B] flex-shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs sm:text-sm text-[#6B685F] leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8 — Final CTA */}
      <section className="py-20 bg-[#E7EDE2]/60 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#292820] mb-4">
            Your next great idea deserves to be remembered.
          </h2>
          <p className="text-sm sm:text-base text-[#56544D] mb-8 max-w-xl mx-auto">
            Join readers who treat their books as lifelong companions rather than disposable entertainment.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white font-medium text-sm shadow-sm transition-all"
          >
            <span>Start your free library</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
