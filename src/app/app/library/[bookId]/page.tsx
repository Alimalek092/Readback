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
  CheckCircle2,
  Circle,
  X,
  Calendar,
} from 'lucide-react';
import { Book, Note, UserProfile, BookStatus, ActionItem } from '@/lib/types';
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
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'lessons' | 'quotes' | 'reflections' | 'actions'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Progress inline edit
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [newProgress, setNewProgress] = useState(0);

  // Full Edit Book modal
  const [editBookOpen, setEditBookOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editStatus, setEditStatus] = useState<BookStatus>('currently_reading');
  const [editProgress, setEditProgress] = useState(0);
  const [editCoverUrl, setEditCoverUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // New Action Item form
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionDue, setNewActionDue] = useState('');

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
          setEditTitle(data.book.title);
          setEditAuthor(data.book.author);
          setEditCategory(data.book.category);
          setEditStatus(data.book.status);
          setEditProgress(data.book.progressPercentage);
          setEditCoverUrl(data.book.coverUrl || '');
          setEditDescription(data.book.description || '');
        }
        setIsLoading(false);
      })
      .catch(console.error);

    fetch('/api/actions')
      .then((res) => res.json())
      .then((data) => {
        if (data.actions) {
          setActions(data.actions.filter((a: ActionItem) => a.bookId === bookId));
        }
      })
      .catch(console.error);

    fetch('/api/profile')
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

  const handleStatusChange = async (nextStatus: BookStatus) => {
    if (!book) return;
    const nextProg =
      nextStatus === 'completed' ? 100 : nextStatus === 'want_to_read' ? 0 : book.progressPercentage;

    const res = await fetch(`/api/books/${book.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: nextStatus,
        progressPercentage: nextProg,
        startedAt:
          nextStatus === 'currently_reading' && !book.startedAt
            ? new Date().toISOString()
            : book.startedAt,
        completedAt: nextStatus === 'completed' ? new Date().toISOString() : book.completedAt,
      }),
    });
    if (res.ok) fetchBookData();
  };

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

  const handleSaveBookEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;
    const res = await fetch(`/api/books/${book.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editTitle.trim(),
        author: editAuthor.trim(),
        category: editCategory.trim() || 'General',
        status: editStatus,
        progressPercentage: Number(editProgress),
        coverUrl: editCoverUrl.trim() || undefined,
        description: editDescription.trim() || undefined,
      }),
    });
    if (res.ok) {
      setEditBookOpen(false);
      fetchBookData();
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

  const handleCreateAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle.trim() || !book) return;

    const res = await fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId: book.id,
        noteId: notes[0]?.id || book.id,
        title: newActionTitle.trim(),
        dueDate: newActionDue || undefined,
      }),
    });

    if (res.ok) {
      setNewActionTitle('');
      setNewActionDue('');
      fetchBookData();
    }
  };

  const handleToggleAction = async (action: ActionItem) => {
    const nextStatus = action.status === 'completed' ? 'pending' : 'completed';
    const res = await fetch(`/api/actions/${action.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) {
      setActions((prev) =>
        prev.map((a) => (a.id === action.id ? { ...a, status: nextStatus } : a))
      );
    }
  };

  const handleDeleteAction = async (actionId: string) => {
    const res = await fetch(`/api/actions/${actionId}`, { method: 'DELETE' });
    if (res.ok) {
      setActions((prev) => prev.filter((a) => a.id !== actionId));
    }
  };

  if (isLoading || !book) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center text-[#858276]">
        <p className="text-sm">Opening book knowledge page...</p>
      </div>
    );
  }

  const filteredNotes = notes.filter((n) => {
    if (activeTab === 'lessons') return n.noteType === 'lesson';
    if (activeTab === 'quotes') return n.noteType === 'quote';
    if (activeTab === 'reflections') return Boolean(n.personalReflection);
    return true;
  });

  const lessonsCount = notes.filter((n) => n.noteType === 'lesson').length;
  const quotesCount = notes.filter((n) => n.noteType === 'quote').length;
  const reflectionsCount = notes.filter((n) => Boolean(n.personalReflection)).length;

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#292820] flex flex-col md:flex-row">
      {user && (
        <Sidebar
          user={user}
          onOpenQuickCapture={() => {
            setEditingNote(null);
            setQuickCaptureOpen(true);
          }}
        />
      )}

      <main className="flex-1 md:pl-64 min-h-screen flex flex-col">
        <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
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
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-mono uppercase text-[#74866B] bg-[#E7EDE2] px-2 py-0.5 rounded">
                    {book.category}
                  </span>
                  <select
                    value={book.status}
                    onChange={(e) => handleStatusChange(e.target.value as BookStatus)}
                    className="text-xs font-mono uppercase bg-[#F8F6F0] border border-[#E9E5DC] rounded px-2 py-0.5 text-[#292820] focus:border-[#74866B]"
                  >
                    <option value="currently_reading">Currently Reading</option>
                    <option value="want_to_read">Want to Read</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                    <option value="abandoned">Abandoned</option>
                  </select>
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingNote(null);
                        setQuickCaptureOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-xs font-medium shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Capture Note</span>
                    </button>
                    <button
                      onClick={() => setEditBookOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button border border-[#E9E5DC] bg-white hover:bg-[#F8F6F0] text-[#292820] text-xs font-medium transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Book</span>
                    </button>
                  </div>

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
                Action Items
              </span>
              <span className="font-serif text-xl font-bold text-[#292820] num-tabular">
                {actions.length}
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
              <button
                onClick={() => setActiveTab('actions')}
                className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'actions'
                    ? 'border-[#74866B] text-[#74866B]'
                    : 'border-transparent text-[#858276] hover:text-[#292820]'
                }`}
              >
                Actions ({actions.length})
              </button>
            </div>

            {activeTab === 'actions' ? (
              <div className="space-y-4">
                <form
                  onSubmit={handleCreateAction}
                  className="bg-white rounded-xl border border-[#E9E5DC] p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
                >
                  <input
                    type="text"
                    required
                    placeholder="Add a concrete action to apply from this book..."
                    value={newActionTitle}
                    onChange={(e) => setNewActionTitle(e.target.value)}
                    className="flex-1 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2 text-[#292820] focus:border-[#74866B] focus:bg-white"
                  />
                  <input
                    type="date"
                    value={newActionDue}
                    onChange={(e) => setNewActionDue(e.target.value)}
                    className="text-xs bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2 text-[#292820]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-xs font-semibold whitespace-nowrap"
                  >
                    + Add Action
                  </button>
                </form>

                {actions.length > 0 ? (
                  <div className="space-y-2.5">
                    {actions.map((act) => (
                      <div
                        key={act.id}
                        className="bg-white rounded-xl border border-[#E9E5DC] p-4 flex items-center justify-between gap-3"
                      >
                        <button
                          onClick={() => handleToggleAction(act)}
                          className="flex items-center gap-3 text-left flex-1 min-w-0"
                        >
                          {act.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-[#6F8F70] flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#858276] flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p
                              className={`text-sm font-medium ${
                                act.status === 'completed'
                                  ? 'line-through text-[#858276]'
                                  : 'text-[#292820]'
                              }`}
                            >
                              {act.title}
                            </p>
                            {act.dueDate && (
                              <p className="text-[11px] text-[#858276] flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3" />
                                <span>Due {act.dueDate}</span>
                              </p>
                            )}
                          </div>
                        </button>
                        <button
                          onClick={() => handleDeleteAction(act.id)}
                          className="p-1.5 text-[#858276] hover:text-[#B96C64]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 rounded-xl bg-white border border-[#E9E5DC] text-center">
                    <p className="text-xs text-[#858276]">
                      No action items yet. Turn one lesson from this book into a real-world commitment above.
                    </p>
                  </div>
                )}
              </div>
            ) : filteredNotes.length > 0 ? (
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
                          onClick={() => {
                            setEditingNote(note);
                            setQuickCaptureOpen(true);
                          }}
                          className="p-1 text-[#858276] hover:text-[#292820] rounded transition-colors"
                          title="Edit note"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
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
                  onClick={() => {
                    setEditingNote(null);
                    setQuickCaptureOpen(true);
                  }}
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

      {/* Edit Book Modal */}
      {editBookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E9E5DC] shadow-elevated overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E9E5DC] bg-[#FAF8F5]">
              <h3 className="font-serif text-lg font-semibold text-[#292820]">Edit Book Details</h3>
              <button onClick={() => setEditBookOpen(false)} className="text-[#858276] hover:text-[#292820]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveBookEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    required
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as BookStatus)}
                    className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2"
                  >
                    <option value="currently_reading">Currently Reading</option>
                    <option value="want_to_read">Want to Read</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                    <option value="abandoned">Abandoned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1">
                    Progress ({editProgress}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editProgress}
                    onChange={(e) => setEditProgress(Number(e.target.value))}
                    className="w-full accent-[#74866B] mt-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={editCoverUrl}
                  onChange={(e) => setEditCoverUrl(e.target.value)}
                  className="w-full text-xs font-mono bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2 resize-none"
                />
              </div>
              <div className="pt-3 border-t border-[#E9E5DC] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditBookOpen(false)}
                  className="px-4 py-2 text-xs text-[#858276]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-button bg-[#74866B] text-white hover:bg-[#617258]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <QuickCaptureModal
        isOpen={quickCaptureOpen}
        onClose={() => {
          setQuickCaptureOpen(false);
          setEditingNote(null);
        }}
        defaultBookId={book.id}
        editNote={editingNote}
        onNoteCreated={fetchBookData}
      />
    </div>
  );
}
