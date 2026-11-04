import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#F1EEE6] border-t border-[#E9E5DC] py-12 text-[#56544D]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#74866B] flex items-center justify-center text-white">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="font-serif text-lg font-bold text-[#292820]">
                ReadBack
              </span>
            </Link>
            <p className="text-xs text-[#858276] leading-relaxed">
              Read less forgetfully. Learn more permanently. A personal knowledge companion for thoughtful readers.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#292820] mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#how-it-works" className="hover:text-[#292820] transition-colors">
                  The Learning Loop
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-[#292820] transition-colors">
                  Daily Review & Repetition
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#292820] transition-colors">
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[#292820] transition-colors">
                  Start Free Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#292820] mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-[#292820] transition-colors">
                  About ReadBack
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#292820] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#292820] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Reading Philosophy */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#292820] mb-3">
              Philosophy
            </h4>
            <p className="text-xs text-[#858276] leading-relaxed italic font-serif">
              "You do not rise to the level of your reading volume; you fall to the level of the lessons you actually retain and live by."
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#E9E5DC] flex flex-col sm:flex-row items-center justify-between text-xs text-[#858276] gap-4">
          <p>© {new Date().getFullYear()} ReadBack Technologies. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#292820]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#292820]">
              Terms
            </Link>
            <Link href="/login" className="hover:text-[#292820]">
              Reader Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
