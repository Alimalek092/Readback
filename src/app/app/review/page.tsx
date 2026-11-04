'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  RotateCw,
  BookOpen,
  ArrowRight,
  Eye,
  CheckCircle2,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  Clock,
  Layers,
} from 'lucide-react';
import { ReviewSchedule, Note, Book, UserProfile, ReviewRating } from '@/lib/types';
import { Sidebar } from '@/components/Sidebar';
import { QuickCaptureModal } from '@/components/QuickCaptureModal';

interface QueueItem {
  schedule: ReviewSchedule;
  note: Note;
  book: Book;
}

export default function ReviewPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedReflection, setRevealedReflection] = useState(false);
  const [reviewedCountSession, setReviewedCountSession] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);

  const fetchReviewQueue = () => {
    setIsLoading(true);
    fetch('/api/review')
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/login';
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setQueue(data.queue || []);
          setStreak(data.streak || 0);
          if (!data.queue || data.queue.length === 0) {
            setSessionComplete(true);
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });

    // Fetch user profile
    fetch('/api/export?format=json')
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) setUser(data.profile);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchReviewQueue();
  }, []);

  const handleRate = async (rating: ReviewRating) => {
    if (currentIndex >= queue.length || isSubmitting) return;

    const currentItem = queue[currentIndex];
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId: currentItem.note.id,
          rating,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.streak !== undefined) setStreak(data.streak);
        setReviewedCountSession((prev) => prev + 1);

        if (currentIndex + 1 < queue.length) {
          setCurrentIndex((prev) => prev + 1);
          setRevealedReflection(false);
        } else {
          setSessionComplete(true);
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentItem = queue[currentIndex];

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#292820] flex flex-col md:flex-row">
      {user && (
        <Sidebar
          user={user}
          onOpenQuickCapture={() => setQuickCaptureOpen(true)}
        />
      )}

      <main className="flex-1 md:pl-64 min-h-screen flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full mx-auto">
          {isLoading ? (
            <div className="text-center py-16 text-[#858276]">
              <RotateCw className="w-6 h-6 animate-spin mx-auto mb-3 text-[#74866B]" />
              <p className="text-xs">Preparing your daily knowledge deck...</p>
            </div>
          ) : sessionComplete || !currentItem ? (
            /* Session Completed Screen */
            <div className="bg-white rounded-2xl border border-[#E9E5DC] p-8 sm:p-12 shadow-card text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#E7EDE2] text-[#6F8F70] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#74866B] block mb-1">
                  Daily Review Complete
                </span>
                <h2 className="font-serif text-3xl text-[#292820]">
                  Beautiful work. You revisited your knowledge today.
                </h2>
                <p className="text-sm text-[#6B685F] max-w-md mx-auto mt-2 leading-relaxed">
                  Every time you recall an idea, you cement it into your permanent mental models.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC]">
                  <span className="text-[11px] text-[#858276] uppercase tracking-wider block mb-1">
                    Reviewed Today
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#292820] num-tabular">
                    {reviewedCountSession > 0 ? reviewedCountSession : 'All caught up'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC]">
                  <span className="text-[11px] text-[#858276] uppercase tracking-wider block mb-1">
                    Current Streak
                  </span>
                  <div className="flex items-center justify-center gap-1.5 text-2xl font-bold font-serif text-[#74866B] num-tabular">
                    <Flame className="w-5 h-5 fill-current" />
                    <span>{streak} Days</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E9E5DC] flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/app"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Return to Dashboard
                </Link>
                <Link
                  href="/app/notes"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-button bg-white border border-[#E9E5DC] text-[#292820] hover:bg-[#F8F6F0] text-xs font-medium transition-all"
                >
                  Browse Knowledge Library
                </Link>
              </div>
            </div>
          ) : (
            /* Active Review Card */
            <div className="space-y-4">
              {/* Progress & Deck Status */}
              <div className="flex items-center justify-between text-xs text-[#858276] px-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#292820] num-tabular">
                    Card {currentIndex + 1} of {queue.length}
                  </span>
                  <span>•</span>
                  <span>Spaced Repetition Deck</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-[#74866B]">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span className="num-tabular">{streak} day streak</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-[#E9E5DC] overflow-hidden">
                <div
                  className="h-full bg-[#74866B] rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / queue.length) * 100}%`,
                  }}
                />
              </div>

              {/* Main Card */}
              <div className="bg-white rounded-2xl border border-[#E9E5DC] p-6 sm:p-8 shadow-card space-y-6">
                {/* Source Book Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E9E5DC] text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#E7EDE2] text-[#74866B] flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#292820]">
                        {currentItem.book.title}
                      </p>
                      <p className="text-[11px] text-[#858276]">
                        By {currentItem.book.author}
                        {currentItem.note.pageNumber && ` • Page ${currentItem.note.pageNumber}`}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase bg-[#F8F6F0] px-2 py-0.5 rounded text-[#74866B] font-semibold border border-[#E9E5DC]">
                    {currentItem.note.noteType}
                  </span>
                </div>

                {/* Concept Title if any */}
                {currentItem.note.title && (
                  <h3 className="font-serif text-xl sm:text-2xl text-[#292820] leading-snug">
                    {currentItem.note.title}
                  </h3>
                )}

                {/* The Lesson or Quote */}
                <blockquote className="font-serif text-lg sm:text-xl text-[#292820] leading-relaxed italic border-l-2 border-[#74866B] pl-4 py-1">
                  "{currentItem.note.content}"
                </blockquote>

                {/* Tags */}
                {currentItem.note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentItem.note.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-[#858276] bg-[#F8F6F0] border border-[#E9E5DC] px-2 py-0.5 rounded-full"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Personal Reflection / Answer Reveal Section */}
                {currentItem.note.personalReflection && (
                  <div className="pt-4 border-t border-[#E9E5DC]">
                    {revealedReflection ? (
                      <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] animate-in fade-in duration-200">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#74866B] block mb-1">
                          Your Personal Reflection & Application
                        </span>
                        <p className="text-xs sm:text-sm text-[#45433B] leading-relaxed">
                          {currentItem.note.personalReflection}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRevealedReflection(true)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#F1EEE6] border border-[#E9E5DC] text-xs font-semibold text-[#858276] hover:text-[#292820] transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#74866B]" />
                        <span>Reveal your personal reflection & answer</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Rating Prompt & Action Buttons */}
                <div className="pt-6 border-t border-[#E9E5DC] space-y-3">
                  <p className="text-center text-xs font-semibold text-[#858276] uppercase tracking-wider">
                    How well did you remember this idea?
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Forgot */}
                    <button
                      onClick={() => handleRate('forgot')}
                      disabled={isSubmitting}
                      className="p-3 rounded-xl border border-[#B96C64]/30 hover:border-[#B96C64] bg-[#B96C64]/5 hover:bg-[#B96C64]/10 text-center transition-all disabled:opacity-50 group"
                    >
                      <span className="block text-xs font-bold text-[#B96C64]">
                        Forgot
                      </span>
                      <span className="block text-[10px] text-[#858276] mt-0.5">
                        Soon / Today
                      </span>
                    </button>

                    {/* Difficult */}
                    <button
                      onClick={() => handleRate('difficult')}
                      disabled={isSubmitting}
                      className="p-3 rounded-xl border border-[#C49A59]/30 hover:border-[#C49A59] bg-[#C49A59]/5 hover:bg-[#C49A59]/10 text-center transition-all disabled:opacity-50 group"
                    >
                      <span className="block text-xs font-bold text-[#C49A59]">
                        Difficult
                      </span>
                      <span className="block text-[10px] text-[#858276] mt-0.5">
                        1 day
                      </span>
                    </button>

                    {/* Easy */}
                    <button
                      onClick={() => handleRate('easy')}
                      disabled={isSubmitting}
                      className="p-3 rounded-xl border border-[#74866B] bg-[#E7EDE2] hover:bg-[#d9e5d2] text-center transition-all shadow-sm disabled:opacity-50 group"
                    >
                      <span className="block text-xs font-bold text-[#475A40]">
                        Easy
                      </span>
                      <span className="block text-[10px] text-[#74866B] mt-0.5 font-medium">
                        3-7+ days
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <QuickCaptureModal
        isOpen={quickCaptureOpen}
        onClose={() => setQuickCaptureOpen(false)}
        onNoteCreated={fetchReviewQueue}
      />
    </div>
  );
}
