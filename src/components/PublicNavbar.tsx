'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, ArrowRight, Menu, X } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F0]/90 backdrop-blur-md border-b border-[#E9E5DC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#74866B] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-[#292820]">
            ReadBack
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#56544D]">
          <Link href="/#how-it-works" className="hover:text-[#292820] transition-colors">
            The 5-Step Loop
          </Link>
          <Link href="/#features" className="hover:text-[#292820] transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-[#292820] transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="hover:text-[#292820] transition-colors">
            About
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-[#56544D] hover:text-[#292820] transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-1.5 px-4 py-2 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-sm font-medium shadow-sm transition-all duration-200"
          >
            <span>Start Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#292820]"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-[#F8F6F0] border-b border-[#E9E5DC] space-y-3">
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#56544D]"
          >
            The 5-Step Loop
          </Link>
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#56544D]"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#56544D]"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#56544D]"
          >
            About
          </Link>
          <div className="pt-3 border-t border-[#E9E5DC] flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full text-center py-2 text-sm font-medium text-[#292820] border border-[#E9E5DC] rounded-lg"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="w-full text-center py-2 text-sm font-medium text-white bg-[#74866B] rounded-lg"
            >
              Start Building Knowledge
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
