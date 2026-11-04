'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-[#74866B] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#292820]">
            ReadBack
          </span>
        </Link>
        <h2 className="font-serif text-2xl font-normal text-[#292820]">
          Reset your password
        </h2>
        <p className="mt-2 text-xs text-[#858276]">
          Enter your registered email address and we will send you recovery instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#E9E5DC] shadow-card">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[#E7EDE2] text-[#6F8F70] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#292820] mb-2">
                Check your inbox
              </h3>
              <p className="text-xs text-[#858276] leading-relaxed mb-6">
                If an account exists for <span className="font-medium text-[#292820]">{email}</span>, we have sent a secure password reset link.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74866B] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to sign in</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="reader@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-xl px-3.5 py-2.5 text-[#292820] placeholder:text-[#858276]/60 focus:border-[#74866B] focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-sm font-medium shadow-sm transition-all duration-200"
              >
                Send Reset Link
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-xs text-[#858276] hover:text-[#292820]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
