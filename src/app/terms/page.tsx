import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#292820] flex flex-col">
      <PublicNavbar />

      <main className="flex-1 py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-[#E9E5DC] pb-8 mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#74866B] mb-2 block">
              Terms of Service
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#292820] mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xs text-[#858276]">
              Last updated: November 4, 2026
            </p>
          </div>

          <div className="space-y-8 text-sm text-[#45433B] leading-relaxed">
            <section>
              <h2 className="font-serif text-xl text-[#292820] mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By creating an account or accessing the ReadBack application and website, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#292820] mb-3">
                2. Acceptable Use & Intellectual Property
              </h2>
              <p>
                ReadBack is provided for personal, non-commercial reading journal purposes. You agree not to upload unlawful, infringing, or abusive material. Book excerpts and quotations saved by users remain subject to fair use and the intellectual property rights of their respective authors and publishers. ReadBack does not distribute complete copyrighted books.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#292820] mb-3">
                3. Subscriptions & Billing
              </h2>
              <p>
                ReadBack offers a Free tier and a paid Plus tier. Subscriptions renew automatically at the end of each billing cycle (monthly or annually) unless canceled prior to the renewal date. You may cancel your subscription at any time via your Account Settings. Upon cancellation, paid features remain accessible until the conclusion of the active billing period.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#292820] mb-3">
                4. Disclaimer & Limitation of Liability
              </h2>
              <p>
                ReadBack is provided "as is" without warranty of any kind. While we perform regular backups and follow rigorous software engineering standards, you are encouraged to periodically export your notes via our built-in export tool. ReadBack is not liable for indirect or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#292820] mb-3">
                5. Contact & Inquiries
              </h2>
              <p>
                If you have questions regarding these terms, please contact our support desk at{' '}
                <a href="mailto:support@readback.app" className="text-[#74866B] hover:underline">
                  support@readback.app
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
