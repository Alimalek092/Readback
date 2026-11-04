'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Bookmark,
  RotateCw,
  TrendingUp,
  Sparkles,
  PieChart,
  Calendar,
} from 'lucide-react';
import { Book, Note, UserProfile, ReviewHistoryEntry } from '@/lib/types';
import { Sidebar } from '@/components/Sidebar';
import { QuickCaptureModal } from '@/components/QuickCaptureModal';

export default function InsightsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [history, setHistory] = useState<ReviewHistoryEntry[]>([]);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/export?format=json')
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/login';
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUser(data.profile);
          setBooks(data.books || []);
          setNotes(data.notes || []);
          setHistory(data.reviewHistory || []);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  // Compute genuine statistics
  const completedBooks = books.filter((b) => b.status === 'completed');
  const readingBooks = books.filter((b) => b.status === 'currently_reading');
  const quotesCount = notes.filter((n) => n.noteType === 'quote').length;
  const lessonsCount = notes.filter((n) => n.noteType === 'lesson').length;
  const reflectionsCount = notes.filter((n) => Boolean(n.personalReflection)).length;

  // Category distribution
  const categoryCounts: Record<string, number> = {};
  books.forEach((b) => {
    categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
  });

  // Note type distribution
  const typeCounts: Record<string, number> = {};
  notes.forEach((n) => {
    typeCounts[n.noteType] = (typeCounts[n.noteType] || 0) + 1;
  });

  // Monthly summary calculation
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const booksTouchedThisMonth = new Set(notes.map((n) => n.bookId)).size;

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#292820] flex flex-col md:flex-row">
      {user && (
        <Sidebar
          user={user}
          onOpenQuickCapture={() => setQuickCaptureOpen(true)}
        />
      )}

      <main className="flex-1 md:pl-64 min-h-screen flex flex-col">
        <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
          {/* Header */}
          <div className="border-b border-[#E9E5DC] pb-4">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#292820]">
              Reading & Retention Insights
            </h1>
            <p className="text-xs sm:text-sm text-[#858276] mt-1">
              Honest metrics to understand your reading consistency, memory recall, and learning habits.
            </p>
          </div>

          {/* Monthly Reflection Banner */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E9E5DC] p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#74866B] font-semibold">
                Monthly Synthesis • {currentMonth}
              </span>
              <h3 className="font-serif text-xl text-[#292820]">
                You have captured {notes.length} ideas across {booksTouchedThisMonth} books.
              </h3>
              <p className="text-xs text-[#6B685F]">
                {history.length > 0
                  ? `Completed ${history.length} recall reviews to prevent knowledge fade.`
                  : 'Start your daily reviews to build consistent spaced repetition habits.'}
              </p>
            </div>
            <Link
              href="/app/review"
              className="px-4 py-2 text-xs font-semibold rounded-button bg-[#74866B] hover:bg-[#617258] text-white whitespace-nowrap shadow-sm"
            >
              Start Today's Review
            </Link>
          </div>

          {/* 4 Primary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#E9E5DC] shadow-subtle">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#858276] block mb-1">
                Total Books
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-3xl font-bold text-[#292820] num-tabular">
                  {books.length}
                </span>
                <span className="text-xs text-[#858276]">in library</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E9E5DC] shadow-subtle">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#858276] block mb-1">
                Completed
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-3xl font-bold text-[#6F8F70] num-tabular">
                  {completedBooks.length}
                </span>
                <span className="text-xs text-[#858276]">finished</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E9E5DC] shadow-subtle">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#858276] block mb-1">
                Ideas Captured
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-3xl font-bold text-[#292820] num-tabular">
                  {notes.length}
                </span>
                <span className="text-xs text-[#858276]">notes</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E9E5DC] shadow-subtle">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#858276] block mb-1">
                Reviews Conducted
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-3xl font-bold text-[#74866B] num-tabular">
                  {history.length}
                </span>
                <span className="text-xs text-[#858276]">recalled</span>
              </div>
            </div>
          </div>

          {/* Breakdown Charts / Distribution Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Knowledge Composition */}
            <div className="bg-white rounded-2xl border border-[#E9E5DC] p-6 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-[#E9E5DC] pb-3">
                <h3 className="font-serif text-lg text-[#292820]">
                  Knowledge Composition
                </h3>
                <span className="text-xs text-[#858276] font-mono">By Note Type</span>
              </div>

              {notes.length > 0 ? (
                <div className="space-y-3 pt-1">
                  {Object.entries(typeCounts).map(([type, count]) => {
                    const percentage = Math.round((count / notes.length) * 100);
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="capitalize text-[#292820] font-medium">
                            {type}
                          </span>
                          <span className="text-[#858276] num-tabular">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#F1EEE6] overflow-hidden">
                          <div
                            className="h-full bg-[#74866B] rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#858276] py-6 text-center">
                  Capture your first note to see knowledge distribution.
                </p>
              )}
            </div>

            {/* Library Category Breakdown */}
            <div className="bg-white rounded-2xl border border-[#E9E5DC] p-6 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-[#E9E5DC] pb-3">
                <h3 className="font-serif text-lg text-[#292820]">
                  Library Categories
                </h3>
                <span className="text-xs text-[#858276] font-mono">By Topic</span>
              </div>

              {books.length > 0 ? (
                <div className="space-y-3 pt-1">
                  {Object.entries(categoryCounts).map(([cat, count]) => {
                    const percentage = Math.round((count / books.length) * 100);
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#292820] font-medium truncate max-w-[200px]">
                            {cat}
                          </span>
                          <span className="text-[#858276] num-tabular">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#F1EEE6] overflow-hidden">
                          <div
                            className="h-full bg-[#6F8F70] rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#858276] py-6 text-center">
                  Add books to see your interest breakdown.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <QuickCaptureModal
        isOpen={quickCaptureOpen}
        onClose={() => setQuickCaptureOpen(false)}
      />
    </div>
  );
}
