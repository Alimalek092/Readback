'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';
import { Book, BookStatus, UserProfile } from '@/lib/types';
import { BookCover } from '@/components/BookCoverFallback';
import { AddBookModal } from '@/components/AddBookModal';
import { Sidebar } from '@/components/Sidebar';
import { QuickCaptureModal } from '@/components/QuickCaptureModal';

export default function LibraryPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'progress'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLibrary = () => {
    setIsLoading(true);
    fetch('/api/books')
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/login';
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.books) {
          setBooks(data.books);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchLibrary();
    // Fetch profile for sidebar
    fetch('/api/export?format=json')
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) setUser(data.profile);
      })
      .catch(console.error);
  }, []);

  // Filter and sort books
  const filteredBooks = books.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'progress') return b.progressPercentage - a.progressPercentage;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const statusTabs: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Books', count: books.length },
    {
      id: 'currently_reading',
      label: 'Reading',
      count: books.filter((b) => b.status === 'currently_reading').length,
    },
    {
      id: 'completed',
      label: 'Completed',
      count: books.filter((b) => b.status === 'completed').length,
    },
    {
      id: 'want_to_read',
      label: 'Want to Read',
      count: books.filter((b) => b.status === 'want_to_read').length,
    },
    {
      id: 'paused',
      label: 'Paused',
      count: books.filter((b) => b.status === 'paused').length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#292820] flex flex-col md:flex-row">
      {user && (
        <Sidebar
          user={user}
          onOpenQuickCapture={() => setQuickCaptureOpen(true)}
        />
      )}

      <main className="flex-1 md:pl-64 min-h-screen flex flex-col">
        <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E5DC]">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#292820]">
                My Bookshelf
              </h1>
              <p className="text-xs sm:text-sm text-[#858276] mt-1">
                Your personal collection of literary companions and wisdom sources.
              </p>
            </div>

            <button
              onClick={() => setAddBookOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add a Book</span>
            </button>
          </div>

          {/* Filter Bar & Search */}
          <div className="space-y-4">
            {/* Status Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {statusTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    statusFilter === tab.id
                      ? 'bg-[#E7EDE2] text-[#475A40] font-semibold border border-[#74866B]/30'
                      : 'bg-white text-[#858276] border border-[#E9E5DC] hover:text-[#292820]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] opacity-75 num-tabular">({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Search, Sort, View Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E9E5DC]">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-[#858276] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter by title, author, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg pl-8 pr-3 py-1.5 text-[#292820] placeholder:text-[#858276]/60 focus:border-[#74866B] focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                {/* Sort */}
                <div className="flex items-center gap-1.5 text-xs text-[#858276]">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-2 py-1 text-xs text-[#292820] focus:border-[#74866B]"
                  >
                    <option value="updated">Recently Updated</option>
                    <option value="title">Alphabetical (Title)</option>
                    <option value="progress">Reading Progress</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center p-0.5 rounded-lg bg-[#F8F6F0] border border-[#E9E5DC]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md ${
                      viewMode === 'grid'
                        ? 'bg-white text-[#292820] shadow-xs'
                        : 'text-[#858276] hover:text-[#292820]'
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md ${
                      viewMode === 'list'
                        ? 'bg-white text-[#292820] shadow-xs'
                        : 'text-[#858276] hover:text-[#292820]'
                    }`}
                    title="List view"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Book Cards Grid / List */}
          {sortedBooks.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sortedBooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/app/library/${book.id}`}
                    className="group bg-white rounded-xl border border-[#E9E5DC] p-3 flex flex-col justify-between hover:border-[#74866B] hover:shadow-card transition-all"
                  >
                    <div className="space-y-3">
                      <div className="w-full aspect-[2/3] overflow-hidden rounded-lg">
                        <BookCover
                          title={book.title}
                          author={book.author}
                          coverUrl={book.coverUrl}
                          className="w-full h-full"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#74866B] block truncate mb-0.5">
                          {book.category}
                        </span>
                        <h3 className="font-serif text-sm font-semibold text-[#292820] group-hover:text-[#74866B] line-clamp-2 leading-snug">
                          {book.title}
                        </h3>
                        <p className="text-xs text-[#858276] line-clamp-1 mt-0.5">
                          {book.author}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#E9E5DC]/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-[#858276]">
                        <span>{book.notesCount || 0} notes</span>
                        <span className="num-tabular font-medium text-[#292820]">
                          {book.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-[#F1EEE6] overflow-hidden">
                        <div
                          className="h-full bg-[#74866B] rounded-full"
                          style={{ width: `${book.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#E9E5DC] divide-y divide-[#E9E5DC]">
                {sortedBooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/app/library/${book.id}`}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-14 flex-shrink-0">
                        <BookCover
                          title={book.title}
                          author={book.author}
                          coverUrl={book.coverUrl}
                          className="w-full h-full shadow-none"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif text-base font-semibold text-[#292820] group-hover:text-[#74866B] truncate">
                          {book.title}
                        </h3>
                        <p className="text-xs text-[#858276] truncate">
                          {book.author} • <span className="font-mono">{book.category}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-shrink-0 text-xs text-[#858276]">
                      <span className="hidden sm:inline-block font-mono">
                        {book.status.replace(/_/g, ' ')}
                      </span>
                      <span className="font-semibold text-[#292820] num-tabular">
                        {book.notesCount || 0} notes
                      </span>
                      <div className="w-16 hidden sm:block">
                        <div className="w-full h-1.5 rounded-full bg-[#F1EEE6] overflow-hidden">
                          <div
                            className="h-full bg-[#74866B] rounded-full"
                            style={{ width: `${book.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          ) : (
            <div className="p-12 rounded-2xl bg-white border border-[#E9E5DC] text-center max-w-md mx-auto my-8">
              <BookOpen className="w-10 h-10 text-[#74866B] mx-auto mb-3 opacity-60" />
              <h3 className="font-serif text-xl font-semibold text-[#292820] mb-2">
                Your library starts with one book.
              </h3>
              <p className="text-xs text-[#858276] leading-relaxed mb-6">
                Add the first book you want to remember. You can search from millions of titles via Open Library or enter it manually.
              </p>
              <button
                onClick={() => setAddBookOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add your first book</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <AddBookModal
        isOpen={addBookOpen}
        onClose={() => setAddBookOpen(false)}
        onBookAdded={fetchLibrary}
      />

      <QuickCaptureModal
        isOpen={quickCaptureOpen}
        onClose={() => setQuickCaptureOpen(false)}
        onNoteCreated={fetchLibrary}
      />
    </div>
  );
}
