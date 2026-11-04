import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#292820] flex flex-col">
      <PublicNavbar />

      <main className="flex-1 py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-[#E9E5DC] pb-8 mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#74866B] mb-2 block">
              Reader Privacy Agreement
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#292820] mb-4">
              Privacy Policy
            </h1>
            <p className="text-xs text-[#858276]">
              Last updated: November 4, 2026 • Effective immediately
            </p>
          </div>

          <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E9E5DC] mb-10 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#74866B] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#56544D] leading-relaxed">
              <strong>Our Privacy Promise:</strong> ReadBack treats your book highlights and personal reflections as sacred private property. We will never sell your personal data, run advertising networks against your notes, or share your knowledge library with unauthorized third parties.
            </p>
          </div>

          <div className="space-y-8 text-sm text-[#45433B] leading-relaxed">
            <section>
              <h2 className="font-serif text-xl text-[#292820] mb-3">
                1. Information We Collect
              </h2>
              <p className="mb-2">We collect only information necessary to deliver and preserve your personal reading library:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#56544D]">
                <li><strong>Account Credentials:</strong> Email address and display name for authentication and service delivery.</li>
                <li><strong>Library Contents:</strong> Book titles, authors, categories, status, reading progress, and publication years you intentionally input.</li>
                <li><strong>Notes & Reflections:</strong> Lessons, quotes, personal thoughts, tags, and action items you save.</li>
                <li><strong>Review Metrics:</strong> Timestamps of reviews, memory difficulty ratings (Forgot / Difficult / Easy), and schedule intervals required for the spaced-repetition algorithm.</li>
                <li><strong>Payment Data:</strong> Handled securely through commercial PCI-compliant processors (e.g. Stripe/Polar). We never store raw credit card numbers.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#292820] mb-3">
                2. How We Use Your Information
              </h2>
              <p>We use your information exclusively to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#56544D]">
                <li>Sync and present your books and notes across your devices.</li>
                <li>Compute and queue your daily 'Remember Today' spaced repetition schedule.</li>
                <li>Provide accurate reading insights and metrics.</li>
                <li>Enable full data export to Markdown and JSON formats.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#292820] mb-3">
                3. We Do Not Train AI Models on Your Private Notes
              </h2>
              <p>
                Your personal thoughts and reading notes are never fed into foundational AI models for training or public generation. Any optional future AI features (such as 'Ask My Library') operate strictly within your isolated user context with lawful attribution.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#292820] mb-3">
                4. Data Portability and Deletion
              </h2>
              <p>
                You retain complete ownership of your library. You may download a full export in Markdown or JSON from your Settings page at any time. If you choose to delete your account, all associated books, notes, tags, and review history are permanently expunged from our database.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#292820] mb-3">
                5. Legal Review Notice
              </h2>
              <p className="text-xs text-[#858276] italic">
                *Note: This privacy policy reflects our current architecture and reader-first ethical commitment. Prior to full commercial launch in specific jurisdictions (e.g. EU GDPR or California CCPA), formal legal counsel review should be conducted to verify local statutory compliance clauses.*
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
