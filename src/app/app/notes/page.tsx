'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Star,
  BookOpen,
  Trash2,
  Tag as TagIcon,
  Sparkles,
  Plus,
} from 'lucide-react';
import { Note, Book, UserProfile, Tag } from '@/lib/types';
import { Sidebar } from '@/components/Sidebar';
import { QuickCaptureModal } from '@/components/QuickCaptureModal';

export default function NotesLibraryPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [onlyFavourites, setOnlyFavourites] = useState(false);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = () => {
    setIsLoading(true);
    let url = '/api/notes?';
    if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
    if (selectedBookId !== 'all') url += `bookId=${encodeURIComponent(selectedBookId)}&`;
    if (selectedType !== 'all') url += `type=${encodeURIComponent(selectedType)}&`;
    if (selectedTag !== 'all') url += `tag=${encodeURIComponent(selectedTag)}&`;
    if (onlyFavourites) url += `favourite=true&`;

    fetch(url)
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/login';
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.notes) setNotes(data.notes);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // Initial fetch of books and profile
    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => {
        if (data.books) setBooks(data.books);
      })
      .catch(console.error);

    fetch('/api/export?format=json')
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) setUser(data.profile);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedBookId, selectedType, selectedTag, onlyFavourites]);

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
    if (!confirm('Are you sure you want to delete this idea?')) return;
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Extract all unique tags
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags))).sort();

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#292820] flex flex-col md:flex-row">
      {user && (
        <Sidebar
          user={user}
          onOpenQuickCapture={() => setQuickCaptureOpen(true)}
        />
      )}

      <main className="flex-1 md:pl-64 min-h-screen flex flex-col">
        <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E5DC]">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#292820]">
                My Notes
              </h1>
              <p className="text-xs sm:text-sm text-[#858276] mt-1">
                Your accumulated personal knowledge across all books you have read.
              </p>
            </div>

            <button
              onClick={() => setQuickCaptureOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Capture Idea</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-xl border border-[#E9E5DC] space-y-3.5 shadow-subtle">
            {/* Main Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#858276] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search across all your notes, reflections, quotes and tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-xl pl-10 pr-4 py-2 text-[#292820] placeholder:text-[#858276]/60 focus:border-[#74866B] focus:bg-white transition-colors"
              />
            </div>

            {/* Filter selectors row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* Filter by Book */}
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="text-xs bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-2.5 py-1.5 text-[#292820] focus:border-[#74866B]"
              >
                <option value="all">All Books ({books.length})</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>

              {/* Filter by Type */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-xs bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-2.5 py-1.5 text-[#292820] focus:border-[#74866B]"
              >
                <option value="all">All Types</option>
                <option value="lesson">Lessons</option>
                <option value="quote">Quotes</option>
                <option value="thought">Personal Thoughts</option>
                <option value="actionable">Actionable Ideas</option>
                <option value="question">Questions</option>
              </select>

              {/* Filter by Tag */}
              {allTags.length > 0 && (
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="text-xs bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-2.5 py-1.5 text-[#292820] focus:border-[#74866B]"
                >
                  <option value="all">All Tags ({allTags.length})</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      #{tag}
                    </option>
                  ))}
                </select>
              )}

              {/* Favourites Only Toggle */}
              <button
                type="button"
                onClick={() => setOnlyFavourites(!onlyFavourites)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  onlyFavourites
                    ? 'bg-[#FAF0DE] text-[#8C6B2B] border border-[#C49A59]'
                    : 'bg-[#F8F6F0] text-[#858276] border border-[#E9E5DC] hover:text-[#292820]'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${onlyFavourites ? 'fill-current' : ''}`} />
                <span>Favourites only</span>
              </button>
            </div>
          </div>

          {/* Notes List */}
          {notes.length > 0 ? (
            <div className="space-y-4">
              <div className="text-xs text-[#858276] flex items-center justify-between px-1">
                <span>
                  Showing <strong className="text-[#292820] font-semibold">{notes.length}</strong> saved {notes.length === 1 ? 'idea' : 'ideas'}
                </span>
              </div>

              {notes.map((note) => {
                const book = books.find((b) => b.id === note.bookId);
                return (
                  <div
                    key={note.id}
                    className="bg-white rounded-xl border border-[#E9E5DC] p-5 sm:p-6 shadow-subtle hover:border-[#D5CFC1] transition-all"
                  >
                    <div className="flex items-center justify-between text-xs text-[#858276] mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold uppercase tracking-wider text-[10px] text-[#74866B] bg-[#E7EDE2] px-2 py-0.5 rounded">
                          {note.noteType}
                        </span>
                        {note.pageNumber && (
                          <span className="font-mono text-[11px]">
                            Page {note.pageNumber}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleFavourite(note.id)}
                          className={`p-1 rounded transition-colors ${
                            note.isFavourite
                              ? 'text-[#C49A59]'
                              : 'text-[#858276] hover:text-[#292820]'
                          }`}
                          title="Favourite note"
                        >
                          <Star
                            className={`w-4 h-4 ${note.isFavourite ? 'fill-current' : ''}`}
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 text-[#858276] hover:text-[#B96C64] transition-colors"
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
                          Personal Reflection
                        </span>
                        <p className="text-xs text-[#56544D] leading-relaxed">
                          {note.personalReflection}
                        </p>
                      </div>
                    )}

                    <div className="pt-3 border-t border-[#E9E5DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                      {book && (
                        <Link
                          href={`/app/library/${book.id}`}
                          className="text-[#74866B] hover:underline font-medium flex items-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{book.title} ({book.author})</span>
                        </Link>
                      )}

                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {note.tags.map((t, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedTag(t)}
                              className="text-[10px] text-[#858276] bg-[#F8F6F0] hover:bg-[#E7EDE2] hover:text-[#74866B] border border-[#E9E5DC] px-2 py-0.5 rounded-full transition-colors"
                            >
                              #{t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-white border border-[#E9E5DC] text-center max-w-md mx-auto my-8">
              <Search className="w-10 h-10 text-[#74866B] mx-auto mb-3 opacity-60" />
              <h3 className="font-serif text-xl font-semibold text-[#292820] mb-2">
                No matching ideas found.
              </h3>
              <p className="text-xs text-[#858276] leading-relaxed mb-6">
                Try searching for another keyword, clearing your filters, or capturing a new lesson.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBookId('all');
                  setSelectedType('all');
                  setSelectedTag('all');
                  setOnlyFavourites(false);
                }}
                className="text-xs font-semibold text-[#74866B] hover:underline mr-4"
              >
                Clear all filters
              </button>
              <button
                onClick={() => setQuickCaptureOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-button bg-[#74866B] text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Capture an idea</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <QuickCaptureModal
        isOpen={quickCaptureOpen}
        onClose={() => setQuickCaptureOpen(false)}
        onNoteCreated={fetchNotes}
      />
    </div>
  );
}
