'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { PRICING_PLANS } from '@/lib/subscription';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

  const plusPlan =
    billingCycle === 'monthly' ? PRICING_PLANS.plus_monthly : PRICING_PLANS.plus_annual;

  const displayPrice = currency === 'USD' ? `$${plusPlan.priceUSD}` : `₹${plusPlan.priceINR}`;
  const displayPeriod = billingCycle === 'monthly' ? '/ month' : '/ year';

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#292820] flex flex-col">
      <PublicNavbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7EDE2] text-[#475A40] text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Investment in Your Lifelong Wisdom</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl text-[#292820] mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-sm sm:text-base text-[#6B685F] max-w-xl mx-auto mb-10">
            Start building your personal library for free. Upgrade to Plus when you're ready for unlimited capacity and complete knowledge retention.
          </p>

          {/* Toggle controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {/* Monthly / Annual */}
            <div className="inline-flex p-1 rounded-xl bg-[#E9E5DC]/70 border border-[#D8D2C4]">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-[#292820] shadow-sm'
                    : 'text-[#858276] hover:text-[#292820]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-white text-[#292820] shadow-sm'
                    : 'text-[#858276] hover:text-[#292820]'
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#E7EDE2] text-[#74866B]">
                  Save 30%
                </span>
              </button>
            </div>

            {/* Currency selector */}
            <div className="inline-flex p-1 rounded-xl bg-[#E9E5DC]/70 border border-[#D8D2C4]">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currency === 'USD'
                    ? 'bg-white text-[#292820] shadow-sm'
                    : 'text-[#858276] hover:text-[#292820]'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currency === 'INR'
                    ? 'bg-white text-[#292820] shadow-sm'
                    : 'text-[#858276] hover:text-[#292820]'
                }`}
              >
                INR (₹)
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl border border-[#E9E5DC] p-8 shadow-sm flex flex-col justify-between">
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

                <div className="space-y-3.5 mb-8">
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
                Start with Free Library
              </Link>
            </div>

            {/* Plus Plan */}
            <div className="bg-[#FAF8F5] rounded-2xl border-2 border-[#74866B] p-8 shadow-card flex flex-col justify-between relative">
              <span className="absolute -top-3 right-6 bg-[#74866B] text-white text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold">
                Unlimited
              </span>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#74866B]">
                  {plusPlan.name}
                </span>
                <div className="mt-3 mb-2 flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-bold text-[#292820]">
                    {displayPrice}
                  </span>
                  <span className="text-xs text-[#858276]">{displayPeriod}</span>
                </div>
                <p className="text-xs text-[#6B685F] mb-6">
                  {plusPlan.tagline}
                </p>

                <div className="space-y-3.5 mb-8">
                  {plusPlan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-[#292820] font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#74866B] flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/signup?plan=plus"
                className="w-full text-center py-2.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Upgrade to Plus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Guarantee Note */}
          <div className="mt-14 max-w-xl mx-auto flex items-center justify-center gap-3 text-xs text-[#858276]">
            <ShieldCheck className="w-4 h-4 text-[#74866B]" />
            <span>Cancel anytime with a single click. Your notes remain safely exportable forever.</span>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
