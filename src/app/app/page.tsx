import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { calculateStreak } from '@/lib/spaced-repetition';
import { AppLayout } from '@/components/AppLayout';
import { BookCover } from '@/components/BookCoverFallback';
import {
  RotateCw,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Flame,
  ArrowRight,
  Plus,
  Sparkles,
} from 'lucide-react';

export default async function AppDashboard() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  if (!user.onboardingCompleted) {
    redirect('/app/onboarding');
  }

  // Fetch real database records for this user
  const books = db.getBooks(user.id);
  const notes = db.getNotes(user.id);
  const reviewHistory = db.getReviewHistory(user.id);
  const reviewQueue = db.getReviewQueue(user.id);
  const streak = calculateStreak(reviewHistory);

  // Statistics
  const completedBooks = books.filter((b) => b.status === 'completed');
  const currentlyReading = books.filter((b) => b.status === 'currently_reading');
  const totalReviewedCount = reviewHistory.length;

  // The primary card due for review today
  const primaryDue = reviewQueue.length > 0 ? reviewQueue[0] : null;

  // Date formatting
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppLayout user={user}>
      <div className="space-y-8">
        {/* Top Greeting Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E5DC]">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#292820] tracking-tight">
              {getGreeting()}, {user.displayName.split(' ')[0]}.
            </h1>
            <p className="text-xs sm:text-sm text-[#858276] mt-1">
              {formattedDate} • Your knowledge journey continues.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/app/review"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#E7EDE2] text-[#475A40] text-xs font-semibold hover:bg-[#d8e2d1] transition-colors"
            >
              <Flame className="w-4 h-4 text-[#74866B]" />
              <span className="num-tabular">{streak} Day Streak</span>
            </Link>
          </div>
        </div>

        {/* Real Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-white border border-[#E9E5DC] shadow-subtle">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#858276] mb-1">
              Books Completed
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-serif text-[#292820] num-tabular">
                {completedBooks.length}
              </span>
              <span className="text-xs text-[#858276]">of {books.length}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E9E5DC] shadow-subtle">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#858276] mb-1">
              Ideas Saved
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-serif text-[#292820] num-tabular">
                {notes.length}
              </span>
              <span className="text-xs text-[#858276]">insights</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E9E5DC] shadow-subtle">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#858276] mb-1">
              Ideas Reviewed
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-serif text-[#292820] num-tabular">
                {totalReviewedCount}
              </span>
              <span className="text-xs text-[#858276]">sessions</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E9E5DC] shadow-subtle">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#858276] mb-1">
              Due For Review
            </p>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-bold font-serif num-tabular ${
                  reviewQueue.length > 0 ? 'text-[#74866B]' : 'text-[#858276]'
                }`}
              >
                {reviewQueue.length}
              </span>
              <span className="text-xs text-[#858276]">cards</span>
            </div>
          </div>
        </div>

        {/* Remember Today Spotlight Card — Core Product Differentiator */}
        <section className="rounded-2xl bg-white border border-[#E9E5DC] p-6 sm:p-8 shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#E7EDE2] text-[#74866B] flex items-center justify-center">
                <RotateCw className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-xl text-[#292820]">
                Remember Today
              </h2>
            </div>
            {reviewQueue.length > 0 && (
              <span className="text-xs font-mono text-[#74866B] bg-[#E7EDE2] px-2.5 py-0.5 rounded-full font-semibold">
                {reviewQueue.length} {reviewQueue.length === 1 ? 'idea' : 'ideas'} ready
              </span>
            )}
          </div>

          {primaryDue ? (
            <div className="bg-[#FAF8F5] rounded-xl p-6 border border-[#E9E5DC]">
              <div className="flex items-center justify-between text-xs text-[#858276] mb-3">
                <span className="font-medium text-[#292820]">
                  {primaryDue.book.title}
                </span>
                <span>By {primaryDue.book.author}</span>
              </div>

              <blockquote className="font-serif text-lg sm:text-xl text-[#292820] leading-snug mb-3">
                "{primaryDue.note.content}"
              </blockquote>

              {primaryDue.note.personalReflection && (
                <p className="text-xs text-[#6B685F] italic mb-4 border-l-2 border-[#74866B] pl-3 py-0.5">
                  Personal reflection: {primaryDue.note.personalReflection}
                </p>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#E9E5DC]">
                <div className="flex flex-wrap gap-1.5">
                  {primaryDue.note.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded bg-white border border-[#E9E5DC] text-[#858276]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <Link
                  href="/app/review"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <span>Review today's ideas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-[#FAF8F5] rounded-xl p-8 border border-[#E9E5DC] text-center">
              <div className="w-10 h-10 rounded-full bg-[#E7EDE2] text-[#74866B] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#292820] mb-1">
                You're all caught up.
              </h3>
              <p className="text-xs text-[#858276] max-w-sm mx-auto mb-4">
                You've completed all scheduled reviews for today. Come back when your next ideas are ready for recall.
              </p>
              <Link
                href="/app/notes"
                className="inline-flex items-center gap-1.5 text-xs text-[#74866B] font-semibold hover:underline"
              >
                <span>Browse your knowledge library →</span>
              </Link>
            </div>
          )}
        </section>

        {/* Continue Reading Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#292820]">
              Continue Reading
            </h2>
            <Link
              href="/app/library"
              className="text-xs font-medium text-[#74866B] hover:underline"
            >
              View all books ({books.length}) →
            </Link>
          </div>

          {currentlyReading.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentlyReading.map((book) => (
                <Link
                  key={book.id}
                  href={`/app/library/${book.id}`}
                  className="bg-white rounded-xl border border-[#E9E5DC] p-4 flex gap-4 hover:border-[#74866B] shadow-subtle hover:shadow-card transition-all group"
                >
                  <div className="w-16 h-24 flex-shrink-0">
                    <BookCover
                      title={book.title}
                      author={book.author}
                      coverUrl={book.coverUrl}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#74866B] tracking-wider block mb-1">
                        {book.category}
                      </span>
                      <h3 className="font-serif text-base font-semibold text-[#292820] group-hover:text-[#74866B] line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-xs text-[#858276] line-clamp-1">{book.author}</p>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px] text-[#858276]">
                        <span>{book.notesCount || 0} notes saved</span>
                        <span className="num-tabular font-medium text-[#292820]">
                          {book.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#F1EEE6] overflow-hidden">
                        <div
                          className="h-full bg-[#74866B] rounded-full transition-all duration-300"
                          style={{ width: `${book.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-white border border-[#E9E5DC] text-center">
              <BookOpen className="w-8 h-8 text-[#858276] mx-auto mb-2 opacity-50" />
              <h4 className="font-serif text-base font-semibold text-[#292820] mb-1">
                No book marked as currently reading
              </h4>
              <p className="text-xs text-[#858276] mb-4">
                Add what you are currently reading to capture lessons as you flip through chapters.
              </p>
              <Link
                href="/app/library"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-button bg-[#74866B] text-white hover:bg-[#617258]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add a book</span>
              </Link>
            </div>
          )}
        </section>

        {/* Recent Ideas Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#292820]">
              Recently Captured
            </h2>
            <Link
              href="/app/notes"
              className="text-xs font-medium text-[#74866B] hover:underline"
            >
              Search all notes ({notes.length}) →
            </Link>
          </div>

          {notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.slice(0, 4).map((note) => {
                const book = books.find((b) => b.id === note.bookId);
                return (
                  <div
                    key={note.id}
                    className="bg-white rounded-xl border border-[#E9E5DC] p-5 shadow-subtle flex flex-col justify-between hover:border-[#D5CFC1] transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#858276] mb-2">
                        <span className="font-semibold uppercase tracking-wider text-[10px] text-[#74866B]">
                          {note.noteType}
                        </span>
                        {note.pageNumber && <span>p. {note.pageNumber}</span>}
                      </div>

                      {note.title && (
                        <h4 className="font-serif text-base font-semibold text-[#292820] mb-1.5">
                          {note.title}
                        </h4>
                      )}

                      <p className="text-xs sm:text-sm text-[#45433B] leading-relaxed line-clamp-3 mb-3">
                        "{note.content}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E9E5DC] flex items-center justify-between text-xs">
                      {book && (
                        <Link
                          href={`/app/library/${book.id}`}
                          className="text-[#74866B] hover:underline truncate max-w-[200px]"
                        >
                          From: {book.title}
                        </Link>
                      )}
                      <div className="flex gap-1">
                        {note.tags.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] text-[#858276] bg-[#F8F6F0] px-1.5 py-0.5 rounded"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-white border border-[#E9E5DC] text-center">
              <Bookmark className="w-8 h-8 text-[#858276] mx-auto mb-2 opacity-50" />
              <h4 className="font-serif text-base font-semibold text-[#292820] mb-1">
                Your knowledge library starts with one note.
              </h4>
              <p className="text-xs text-[#858276]">
                Click "Capture an idea" in the sidebar anytime to record a lesson from what you read today.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
