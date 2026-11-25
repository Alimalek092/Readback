'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  CreditCard,
  Download,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile, Subscription } from '@/lib/types';
import { Sidebar } from '@/components/Sidebar';
import { QuickCaptureModal } from '@/components/QuickCaptureModal';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'billing' | 'data'>('profile');
  const [displayName, setDisplayName] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [preferredTime, setPreferredTime] = useState('08:30');
  const [dailyReviewEnabled, setDailyReviewEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [prefSaved, setPrefSaved] = useState(false);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/login';
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.profile) {
          setUser(data.profile);
          setDisplayName(data.profile.displayName);
          setTimezone(data.profile.timezone || 'America/New_York');
          setSubscription(data.subscription || null);
          if (data.preferences) {
            setPreferredTime(data.preferences.preferredReviewTime || '08:30');
            setDailyReviewEnabled(data.preferences.dailyReviewEnabled ?? true);
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, timezone }),
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        setUser(data.profile);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timezone,
          preferredReviewTime: preferredTime,
          dailyReviewEnabled,
        }),
      });
      if (res.ok) {
        setPrefSaved(true);
        setTimeout(() => setPrefSaved(false), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        'Are you sure you want to permanently delete your ReadBack account and all books/notes? This cannot be undone.'
      )
    ) {
      return;
    }

    try {
      const res = await fetch('/api/profile', { method: 'DELETE' });
      if (res.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportData = (format: 'json' | 'markdown') => {
    window.location.href = `/api/export?format=${format}`;
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#292820] flex flex-col md:flex-row">
      {user && (
        <Sidebar
          user={user}
          onOpenQuickCapture={() => setQuickCaptureOpen(true)}
        />
      )}

      <main className="flex-1 md:pl-64 min-h-screen flex flex-col">
        <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
          <div className="border-b border-[#E9E5DC] pb-4">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#292820]">
              Account & Settings
            </h1>
            <p className="text-xs sm:text-sm text-[#858276] mt-1">
              Manage your personal reading profile, review schedules, billing, and data exports.
            </p>
          </div>

          <div className="flex border-b border-[#E9E5DC] gap-6 text-xs font-semibold uppercase tracking-wider overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-[#74866B] text-[#74866B]'
                  : 'border-transparent text-[#858276] hover:text-[#292820]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'preferences'
                  ? 'border-[#74866B] text-[#74866B]'
                  : 'border-transparent text-[#858276] hover:text-[#292820]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Review Preferences</span>
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'billing'
                  ? 'border-[#74866B] text-[#74866B]'
                  : 'border-transparent text-[#858276] hover:text-[#292820]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Membership & Billing</span>
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'data'
                  ? 'border-[#74866B] text-[#74866B]'
                  : 'border-transparent text-[#858276] hover:text-[#292820]'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Data & Privacy</span>
            </button>
          </div>

          {activeTab === 'profile' && user && (
            <div className="bg-white rounded-2xl border border-[#E9E5DC] p-6 sm:p-8 shadow-subtle space-y-6">
              <h2 className="font-serif text-xl text-[#292820]">Personal Profile</h2>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-xl px-3.5 py-2.5 text-[#292820] focus:border-[#74866B] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                    Registered {user.email ? 'Email' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user.email || user.phone || ''}
                    className="w-full text-sm bg-[#FAF8F5] border border-[#E9E5DC] rounded-xl px-3.5 py-2.5 text-[#858276] cursor-not-allowed"
                  />
                  <span className="text-[11px] text-[#858276] mt-1 block">
                    Account created on{' '}
                    {new Date(user.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
                  </span>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Save Changes
                  </button>
                  {isSaved && (
                    <span className="text-xs text-[#6F8F70] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Saved successfully</span>
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="bg-white rounded-2xl border border-[#E9E5DC] p-6 sm:p-8 shadow-subtle space-y-6">
              <h2 className="font-serif text-xl text-[#292820]">Daily Review Preferences</h2>

              <form onSubmit={handleSavePreferences} className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                    Your Timezone
                  </label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-xl px-3.5 py-2.5 text-[#292820] focus:border-[#74866B] focus:bg-white"
                  />
                  <span className="text-[11px] text-[#858276] mt-1 block">
                    Ensures your spaced repetition queue resets at your local midnight.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                    Preferred Daily Review Time
                  </label>
                  <input
                    type="time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-xl px-3.5 py-2.5 text-[#292820] focus:border-[#74866B] focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-xl border border-[#E9E5DC]">
                  <div>
                    <p className="text-xs font-semibold text-[#292820]">
                      Daily Review Reminders
                    </p>
                    <p className="text-[11px] text-[#858276]">
                      Receive a quiet notification when cards are due for recall.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyReviewEnabled}
                    onChange={(e) => setDailyReviewEnabled(e.target.checked)}
                    className="w-4 h-4 accent-[#74866B] cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Save Preferences
                  </button>
                  {prefSaved && (
                    <span className="text-xs text-[#6F8F70] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Preferences updated</span>
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white rounded-2xl border border-[#E9E5DC] p-6 sm:p-8 shadow-subtle space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl text-[#292820]">Membership Status</h2>
                  <p className="text-xs text-[#858276] mt-0.5">
                    Current tier:{' '}
                    <strong className="text-[#74866B] uppercase font-mono">
                      {subscription?.planId === 'free' ? 'Free Library' : 'ReadBack Plus'}
                    </strong>
                  </p>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#E7EDE2] text-[#475A40] font-semibold">
                  Active
                </span>
              </div>

              {(!subscription || subscription.planId === 'free') && (
                <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#292820]">
                    <Sparkles className="w-4 h-4 text-[#74866B]" />
                    <span>Free Plan Limits: 5 Books & 50 Saved Ideas</span>
                  </div>
                  <p className="text-xs text-[#6B685F] leading-relaxed">
                    You are currently using the Free Library plan. Upgrade to ReadBack Plus to unlock unlimited books, unlimited notes, and full exports.
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <span>Upgrade to Plus ($2.99/mo or ₹149/mo)</span>
                  </Link>
                </div>
              )}

              <div className="p-4 rounded-xl border border-[#E9E5DC] bg-[#F8F6F0] space-y-2 text-xs text-[#6B685F]">
                <p className="font-semibold text-[#292820]">Payment Integration Notice:</p>
                <p>
                  ReadBack supports Stripe and Polar for international and localized currency checkout. The server verifies subscription status via webhook signatures before granting Plus privileges.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="bg-white rounded-2xl border border-[#E9E5DC] p-6 sm:p-8 shadow-subtle space-y-6">
              <h2 className="font-serif text-xl text-[#292820]">Data Ownership & Portability</h2>
              <p className="text-xs text-[#6B685F] leading-relaxed">
                You own 100% of your notes and books. You can download a complete backup of your knowledge at any time.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-[#E9E5DC] bg-[#FAF8F5] space-y-2">
                  <h4 className="font-serif text-base font-semibold text-[#292820]">
                    Export to Markdown
                  </h4>
                  <p className="text-xs text-[#858276]">
                    Formatted cleanly with book headings, page numbers, tags, and reflections. Perfect for Obsidian, Notion, or Logseq.
                  </p>
                  <button
                    onClick={() => handleExportData('markdown')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#E9E5DC] bg-white hover:bg-[#F1EEE6] text-xs font-semibold text-[#292820] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .md</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-[#E9E5DC] bg-[#FAF8F5] space-y-2">
                  <h4 className="font-serif text-base font-semibold text-[#292820]">
                    Export to JSON
                  </h4>
                  <p className="text-xs text-[#858276]">
                    Raw database archive including your review schedules, repetition history, and book metadata.
                  </p>
                  <button
                    onClick={() => handleExportData('json')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#E9E5DC] bg-white hover:bg-[#F1EEE6] text-xs font-semibold text-[#292820] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .json</span>
                  </button>
                </div>
              </div>

              <div className="pt-8 border-t border-[#E9E5DC] space-y-3">
                <h3 className="font-serif text-base text-[#B96C64] font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Danger Zone</span>
                </h3>
                <p className="text-xs text-[#858276]">
                  Deleting your account will permanently erase your profile, books, notes, and review history. This action cannot be undone.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 rounded-lg border border-[#B96C64]/30 bg-[#B96C64]/10 hover:bg-[#B96C64]/20 text-[#B96C64] text-xs font-semibold transition-colors"
                >
                  Delete Account & Data
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <QuickCaptureModal
        isOpen={quickCaptureOpen}
        onClose={() => setQuickCaptureOpen(false)}
      />
    </div>
  );
}
