'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to create account.');
        setIsLoading(false);
        return;
      }

      router.push(data.redirectTo || '/app/onboarding');
      router.refresh();
    } catch (err) {
      setErrorMessage('Network connection error. Please try again.');
      setIsLoading(false);
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
          Start building your knowledge
        </h2>
        <p className="mt-2 text-xs text-[#858276]">
          Capture your first book lesson in seconds. No credit card required.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#E9E5DC] shadow-card">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-[#B96C64]/10 border border-[#B96C64]/20 text-[#B96C64] text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Eleanor Vance"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-xl px-3.5 py-2.5 text-[#292820] placeholder:text-[#858276]/60 focus:border-[#74866B] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="reader@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-xl px-3.5 py-2.5 text-[#292820] placeholder:text-[#858276]/60 focus:border-[#74866B] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                Password (min 6 characters)
              </label>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-xl px-3.5 py-2.5 text-[#292820] placeholder:text-[#858276]/60 focus:border-[#74866B] focus:bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-sm font-medium shadow-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isLoading ? 'Creating account...' : 'Create Free Account'}</span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#858276]">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[#74866B] hover:underline">
              Sign in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
