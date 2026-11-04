'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Star,
  Trash2,
  Edit3,
  Calendar,
  Layers,
  CheckCircle2,
  Tag as TagIcon,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { Book, Note, UserProfile, NoteType } from '@/lib/types';
import { BookCover } from '@/components/BookCoverFallback';
import { Sidebar } from '@/components/Sidebar';
import { QuickCaptureModal } from '@/components/QuickCaptureModal';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'lessons' | 'quotes' | 'reflections' | 'actions'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [newProgress, setNewProgress] = useState(0);

  const fetchBookData = () => {
    setIsLoading(true);
    fetch(`/api/books/${bookId}`)
      .then((res) => {
        if (!res.ok) {
          router.push('/app/library');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setBook(data.book);
          setNotes(data.notes || []);
          setNewProgress(data.book.progressPercentage || 0);
        }
        setIsLoading(false);
      })
      .catch(console.error);

    // Fetch user profile for sidebar
    fetch('/api/export?format=json')
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) setUser(data.profile);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (bookId) {
      fetchBookData();
    }
  }, [bookId]);

  const handleUpdateProgress = async () => {
    if (!book) return;
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progressPercentage: Number(newProgress),
          status: newProgress === 100 ? 'completed' : book.status,
          completedAt: newProgress === 100 ? new Date().toISOString() : book.completedAt,
        }),
      });
      if (res.ok) {
        setIsEditingProgress(false);
        fetchBookData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFavourite = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: 'PATCH' });
      if (res.ok) {
        setNotes((prev) =>
          prev.map((n) => (n.id === noteId ? { ...n, isFavourite: !n.isFavourite } : n))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this saved note?')) return;
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBook = async () => {
    if (!confirm('Are you sure you want to remove this book and all its notes from your library?')) {
      return;
    }
    try {
      const res = await fetch(`/api/books/${bookId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/app/library');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || !book) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center text-[#858276]">
        <p className="text-sm">Opening book knowledge page...</p>
      </div>
    );
  }

  // Filter notes by active tab
  const filteredNotes = notes.filter((n) => {
    if (activeTab === 'lessons') return n.noteType === 'lesson';
    if (activeTab === 'quotes') return n.noteType === 'quote';
    if (activeTab === 'reflections') return Boolean(n.personalReflection);
    if (activeTab === 'actions') return n.noteType === 'actionable';
    return true;
  });

  const lessonsCount = notes.filter((n) => n.noteType === 'lesson').length;
  const quotesCount = notes.filter((n) => n.noteType === 'quote').length;
  const reflectionsCount = notes.filter((n) => Boolean(n.personalReflection)).length;
  const actionsCount = notes.filter((n) => n.noteType === 'actionable').length;

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
          {/* Back link */}
          <div>
            <Link
              href="/app/library"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#858276] hover:text-[#292820] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Bookshelf</span>
            </Link>
          </div>

          {/* Book Header Card */}
          <div className="bg-white rounded-2xl border border-[#E9E5DC] p-6 sm:p-8 shadow-card flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            <div className="w-28 sm:w-36 flex-shrink-0 mx-auto sm:mx-0 aspect-[2/3]">
              <BookCover
                title={book.title}
                author={book.author}
                coverUrl={book.coverUrl}
                className="w-full h-full shadow-md"
              />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono uppercase text-[#74866B] bg-[#E7EDE2] px-2 py-0.5 rounded">
                    {book.category}
                  </span>
                  <span className="text-xs font-mono text-[#858276] uppercase">
                    • {book.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl text-[#292820] leading-tight">
                  {book.title}
                </h1>
                <p className="text-sm text-[#858276] mt-1">
                  By <span className="text-[#292820] font-medium">{book.author}</span>
                  {book.publicationYear && ` (${book.publicationYear})`}
                </p>

                {book.description && (
                  <p className="text-xs text-[#6B685F] mt-3 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                )}
              </div>

              {/* Progress & Actions */}
              <div className="pt-4 border-t border-[#E9E5DC] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#858276]">Reading Progress:</span>
                  {isEditingProgress ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newProgress}
                        onChange={(e) => setNewProgress(Number(e.target.value))}
                        className="w-16 px-2 py-0.5 text-xs border border-[#74866B] rounded text-right font-mono"
                      />
                      <span className="text-xs">%</span>
                      <button
                        onClick={handleUpdateProgress}
                        className="text-xs font-semibold text-[#74866B] hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingProgress(false)}
                        className="text-xs text-[#858276]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditingProgress(true)}
                      className="font-mono font-medium text-[#292820] hover:text-[#74866B] flex items-center gap-1"
                    >
                      <span>{book.progressPercentage}%</span>
                      <Edit3 className="w-3 h-3 text-[#858276]" />
                    </button>
                  )}
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#F1EEE6] overflow-hidden">
                  <div
                    className="h-full bg-[#74866B] rounded-full transition-all duration-300"
                    style={{ width: `${book.progressPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    onClick={() => setQuickCaptureOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-xs font-medium shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Capture Note</span>
                  </button>

                  <button
                    onClick={handleDeleteBook}
                    className="text-[#858276] hover:text-[#B96C64] p-1.5 rounded transition-colors"
                    title="Remove book from library"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Book Statistics Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-xl border border-[#E9E5DC]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#858276] block mb-1">
                Lessons Saved
              </span>
              <span className="font-serif text-xl font-bold text-[#292820] num-tabular">
                {lessonsCount}
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E9E5DC]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#858276] block mb-1">
                Quotes Preserved
              </span>
              <span className="font-serif text-xl font-bold text-[#292820] num-tabular">
                {quotesCount}
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E9E5DC]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#858276] block mb-1">
                Reflections Written
              </span>
              <span className="font-serif text-xl font-bold text-[#292820] num-tabular">
                {reflectionsCount}
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E9E5DC]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#858276] block mb-1">
                Actions Attached
              </span>
              <span className="font-serif text-xl font-bold text-[#292820] num-tabular">
                {actionsCount}
              </span>
            </div>
          </div>

          {/* Knowledge Tabs */}
          <div className="space-y-4">
            <div className="flex border-b border-[#E9E5DC] gap-6 text-xs font-semibold uppercase tracking-wider overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'border-[#74866B] text-[#74866B]'
                    : 'border-transparent text-[#858276] hover:text-[#292820]'
                }`}
              >
                All Notes ({notes.length})
              </button>
              <button
                onClick={() => setActiveTab('lessons')}
                className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'lessons'
                    ? 'border-[#74866B] text-[#74866B]'
                    : 'border-transparent text-[#858276] hover:text-[#292820]'
                }`}
              >
                Lessons ({lessonsCount})
              </button>
              <button
                onClick={() => setActiveTab('quotes')}
                className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'quotes'
                    ? 'border-[#74866B] text-[#74866B]'
                    : 'border-transparent text-[#858276] hover:text-[#292820]'
                }`}
              >
                Quotes ({quotesCount})
              </button>
              <button
                onClick={() => setActiveTab('reflections')}
                className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'reflections'
                    ? 'border-[#74866B] text-[#74866B]'
                    : 'border-transparent text-[#858276] hover:text-[#292820]'
                }`}
              >
                Reflections ({reflectionsCount})
              </button>
            </div>

            {/* Note Cards List */}
            {filteredNotes.length > 0 ? (
              <div className="space-y-4">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white rounded-xl border border-[#E9E5DC] p-5 shadow-subtle hover:border-[#D5CFC1] transition-colors relative"
                  >
                    <div className="flex items-center justify-between text-xs text-[#858276] mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold uppercase tracking-wider text-[10px] text-[#74866B] bg-[#E7EDE2] px-2 py-0.5 rounded">
                          {note.noteType}
                        </span>
                        {note.pageNumber && (
                          <span className="text-[11px] font-mono text-[#858276]">
                            Page {note.pageNumber}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleFavourite(note.id)}
                          className={`p-1 rounded transition-colors ${
                            note.isFavourite
                              ? 'text-[#C49A59]'
                              : 'text-[#858276] hover:text-[#292820]'
                          }`}
                          title="Toggle favourite"
                        >
                          <Star
                            className={`w-4 h-4 ${note.isFavourite ? 'fill-current' : ''}`}
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 text-[#858276] hover:text-[#B96C64] rounded transition-colors"
                          title="Delete note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {note.title && (
                      <h3 className="font-serif text-lg font-semibold text-[#292820] mb-2">
                        {note.title}
                      </h3>
                    )}

                    <p className="text-sm text-[#3E3C34] leading-relaxed mb-3 whitespace-pre-line">
                      "{note.content}"
                    </p>

                    {note.personalReflection && (
                      <div className="p-3 bg-[#FAF8F5] rounded-lg border-l-2 border-[#74866B] my-3">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#74866B] block mb-1">
                          Personal Reflection / Application
                        </span>
                        <p className="text-xs text-[#56544D] leading-relaxed">
                          {note.personalReflection}
                        </p>
                      </div>
                    )}

                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {note.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] text-[#858276] bg-[#F8F6F0] border border-[#E9E5DC] px-2 py-0.5 rounded-full"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 rounded-xl bg-white border border-[#E9E5DC] text-center">
                <BookOpen className="w-8 h-8 text-[#74866B] mx-auto mb-2 opacity-50" />
                <h4 className="font-serif text-base font-semibold text-[#292820] mb-1">
                  No notes saved in this tab yet
                </h4>
                <p className="text-xs text-[#858276] mb-4">
                  Capture a meaningful lesson or sentence while reading this book.
                </p>
                <button
                  onClick={() => setQuickCaptureOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-button bg-[#74866B] text-white hover:bg-[#617258]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Capture Note</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <QuickCaptureModal
        isOpen={quickCaptureOpen}
        onClose={() => setQuickCaptureOpen(false)}
        defaultBookId={book.id}
        onNoteCreated={fetchBookData}
      />
    </div>
  );
}
