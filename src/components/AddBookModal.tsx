'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, BookOpen, Plus, Loader2, Sparkles, Check } from 'lucide-react';
import { BookStatus } from '@/lib/types';
import { FormattedBookResult } from '@/lib/open-library';
import { BookCover } from './BookCoverFallback';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded?: () => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onClose,
  onBookAdded,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'manual'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FormattedBookResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Form states for manual or selected book
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [category, setCategory] = useState('Personal Development');
  const [status, setStatus] = useState<BookStatus>('currently_reading');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [publicationYear, setPublicationYear] = useState('');
  const [isbn, setIsbn] = useState('');
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Debounced search via Open Library
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError('');
      try {
        const res = await fetch(`/api/metadata/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        setSearchError('Could not reach book metadata provider. You can enter book details manually.');
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  const selectSearchResult = (item: FormattedBookResult) => {
    setTitle(item.title);
    setAuthor(item.author);
    setCoverUrl(item.coverUrl || '');
    setCategory(item.category || 'General');
    setPublicationYear(item.publicationYear ? String(item.publicationYear) : '');
    setIsbn(item.isbn || '');
    setActiveTab('manual'); // switch to review & finalize step
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setErrorMessage('Please provide both book title and author.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          coverUrl: coverUrl.trim() || undefined,
          category: category.trim() || 'General',
          status,
          progressPercentage: Number(progressPercentage),
          publicationYear: publicationYear ? parseInt(publicationYear, 10) : undefined,
          isbn: isbn.trim() || undefined,
          description: description.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to save book.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      if (onBookAdded) onBookAdded();
      onClose();
    } catch (err) {
      setErrorMessage('Network error while saving book.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-[#E9E5DC] shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E9E5DC] bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#74866B]/15 text-[#74866B] flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#292820]">
              Add a Book to Library
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#858276] hover:text-[#292820] p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E9E5DC] px-6 bg-[#FAF8F5]">
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 mr-6 ${
              activeTab === 'search'
                ? 'border-[#74866B] text-[#74866B]'
                : 'border-transparent text-[#858276] hover:text-[#292820]'
            }`}
          >
            Search Open Library
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'manual'
                ? 'border-[#74866B] text-[#74866B]'
                : 'border-transparent text-[#858276] hover:text-[#292820]'
            }`}
          >
            {title ? 'Review & Customize' : 'Manual Entry'}
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-[#B96C64]/10 border border-[#B96C64]/20 text-[#B96C64] text-xs">
              {errorMessage}
            </div>
          )}

          {activeTab === 'search' ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-[#858276] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search by title (e.g. Atomic Habits, Deep Work) or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-xl pl-10 pr-4 py-2.5 text-[#292820] placeholder:text-[#858276]/60 focus:border-[#74866B] focus:bg-white transition-colors"
                />
              </div>

              {isSearching && (
                <div className="py-8 flex flex-col items-center justify-center text-[#858276]">
                  <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#74866B]" />
                  <p className="text-xs">Searching global library records...</p>
                </div>
              )}

              {searchError && (
                <div className="p-3 text-xs text-[#C49A59] bg-[#C49A59]/10 rounded-lg">
                  {searchError}
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {searchResults.map((item) => (
                    <div
                      key={item.key}
                      onClick={() => selectSearchResult(item)}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E9E5DC] hover:border-[#74866B] hover:bg-[#F8F6F0] cursor-pointer transition-all group"
                    >
                      <div className="w-12 h-16 flex-shrink-0">
                        <BookCover
                          title={item.title}
                          author={item.author}
                          coverUrl={item.coverUrl}
                          className="w-full h-full shadow-none"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#292820] group-hover:text-[#74866B] truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#858276] truncate">{item.author}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#858276]">
                          {item.publicationYear && <span>{item.publicationYear}</span>}
                          {item.category && (
                            <>
                              <span>•</span>
                              <span className="truncate">{item.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-[#74866B] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Select <Plus className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm text-[#858276] mb-3">
                    No matching books found for "{searchQuery}".
                  </p>
                  <button
                    onClick={() => {
                      setTitle(searchQuery);
                      setActiveTab('manual');
                    }}
                    className="text-xs font-medium text-[#74866B] hover:underline"
                  >
                    Enter details manually instead →
                  </button>
                </div>
              )}

              {searchQuery.length < 2 && (
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] text-center">
                  <p className="text-xs text-[#858276]">
                    Type a title or author above to pull authentic metadata from Open Library, or switch to manual entry anytime.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Atomic Habits"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2 text-[#292820] focus:border-[#74866B] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. James Clear"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2 text-[#292820] focus:border-[#74866B] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                    Category / Genre
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Psychology, Habits, Business"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2 text-[#292820] focus:border-[#74866B] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                    Reading Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => {
                      const newStatus = e.target.value as BookStatus;
                      setStatus(newStatus);
                      if (newStatus === 'completed') setProgressPercentage(100);
                      if (newStatus === 'want_to_read') setProgressPercentage(0);
                    }}
                    className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2 text-[#292820] focus:border-[#74866B] focus:bg-white transition-colors"
                  >
                    <option value="currently_reading">Currently Reading</option>
                    <option value="want_to_read">Want to Read</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                    <option value="abandoned">Abandoned</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#858276]">
                      Reading Progress
                    </label>
                    <span className="text-xs font-mono font-medium text-[#292820]">
                      {progressPercentage}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressPercentage}
                    onChange={(e) => setProgressPercentage(Number(e.target.value))}
                    className="w-full accent-[#74866B] cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                    Cover Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2 text-[#292820] focus:border-[#74866B] focus:bg-white transition-colors text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                    Publication Year
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2021"
                    value={publicationYear}
                    onChange={(e) => setPublicationYear(e.target.value)}
                    className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2 text-[#292820] focus:border-[#74866B] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E9E5DC] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-[#858276] hover:text-[#292820] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm rounded-button bg-[#74866B] hover:bg-[#617258] text-white font-medium shadow-sm disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Adding...' : 'Add to My Bookshelf'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
