'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Tag as TagIcon, Sparkles, CornerDownLeft } from 'lucide-react';
import { Book, Note, NoteType } from '@/lib/types';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBookId?: string;
  editNote?: Note | null;
  onNoteCreated?: () => void;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  defaultBookId,
  editNote,
  onNoteCreated,
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>(defaultBookId || '');
  const [noteType, setNoteType] = useState<NoteType>('lesson');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [personalReflection, setPersonalReflection] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSuccessSaved(false);
      setErrorMessage('');

      if (editNote) {
        setSelectedBookId(editNote.bookId);
        setNoteType(editNote.noteType);
        setTitle(editNote.title || '');
        setContent(editNote.content);
        setPageNumber(editNote.pageNumber ? String(editNote.pageNumber) : '');
        setPersonalReflection(editNote.personalReflection || '');
        setTagsInput(editNote.tags.join(', '));
      } else {
        setTitle('');
        setContent('');
        setPageNumber('');
        setPersonalReflection('');
        setTagsInput('');
        setNoteType('lesson');
        if (defaultBookId) setSelectedBookId(defaultBookId);
      }

      fetch('/api/books')
        .then((res) => res.json())
        .then((data) => {
          if (data.books) {
            setBooks(data.books);
            if (!editNote && !selectedBookId && data.books.length > 0) {
              setSelectedBookId(defaultBookId || data.books[0].id);
            }
          }
        })
        .catch(console.error);
    }
  }, [isOpen, defaultBookId, editNote]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedBookId, noteType, title, content, pageNumber, personalReflection, tagsInput, editNote]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) {
      setErrorMessage('Please write down your idea or quote before saving.');
      return;
    }
    if (!selectedBookId) {
      setErrorMessage('Please select the source book for this idea.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const endpoint = editNote ? `/api/notes/${editNote.id}` : '/api/notes';
      const method = editNote ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: selectedBookId,
          title: title.trim() || undefined,
          content: content.trim(),
          noteType,
          pageNumber: pageNumber ? parseInt(pageNumber, 10) : undefined,
          personalReflection: personalReflection.trim() || undefined,
          tags,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to save note');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      if (onNoteCreated) onNoteCreated();

      if (editNote) {
        onClose();
      } else {
        setSuccessSaved(true);
      }
    } catch {
      setErrorMessage('Network error occurred while saving.');
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setPageNumber('');
    setPersonalReflection('');
    setTagsInput('');
    setSuccessSaved(false);
    setErrorMessage('');
  };

  const noteTypes: { type: NoteType; label: string }[] = [
    { type: 'lesson', label: 'Important Lesson' },
    { type: 'quote', label: 'Quote' },
    { type: 'thought', label: 'Personal Thought' },
    { type: 'question', label: 'Question' },
    { type: 'actionable', label: 'Actionable Idea' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#FFFFFF] rounded-2xl border border-[#E9E5DC] shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E9E5DC] bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#74866B]/15 text-[#74866B] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#292820]">
              {editNote ? 'Edit Saved Idea' : 'Capture an Idea'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#858276] hover:text-[#292820] p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successSaved ? (
          <div className="p-8 text-center flex flex-col items-center my-auto">
            <div className="w-12 h-12 rounded-full bg-[#E7EDE2] text-[#6F8F70] flex items-center justify-center mb-4">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h4 className="font-serif text-xl font-semibold text-[#292820] mb-2">
              Your idea has been saved.
            </h4>
            <p className="text-sm text-[#858276] max-w-sm mb-6">
              It has been added to your knowledge library and automatically scheduled for your daily review.
            </p>
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-sm rounded-lg bg-[#74866B] hover:bg-[#617258] text-white font-medium transition-colors"
              >
                Add another idea
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg border border-[#E9E5DC] text-[#292820] hover:bg-[#F8F6F0] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-[#B96C64]/10 border border-[#B96C64]/20 text-[#B96C64] text-xs">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                  Source Book *
                </label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2 text-[#292820] focus:border-[#74866B] focus:bg-white transition-colors"
                >
                  {books.length === 0 ? (
                    <option value="">No books yet. Add one first.</option>
                  ) : (
                    books.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} ({b.author})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                  Knowledge Type
                </label>
                <select
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value as NoteType)}
                  className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2 text-[#292820] focus:border-[#74866B] focus:bg-white transition-colors"
                >
                  {noteTypes.map((nt) => (
                    <option key={nt.type} value={nt.type}>
                      {nt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                  Headline / Concept (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. The 1% Rule or Identity-based habits"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2 text-[#292820] placeholder:text-[#858276]/60 focus:border-[#74866B] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                  Page # (Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 42"
                  value={pageNumber}
                  onChange={(e) => setPageNumber(e.target.value)}
                  className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg px-3 py-2 text-[#292820] placeholder:text-[#858276]/60 focus:border-[#74866B] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                The Lesson or Quote *
              </label>
              <textarea
                required
                rows={4}
                placeholder="What valuable lesson, idea, or quote did you read?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg p-3 text-[#292820] placeholder:text-[#858276]/60 focus:border-[#74866B] focus:bg-white transition-colors leading-relaxed resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                Personal Application / Reflection (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="How does this apply to your life, work, or decisions?"
                value={personalReflection}
                onChange={(e) => setPersonalReflection(e.target.value)}
                className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg p-3 text-[#292820] placeholder:text-[#858276]/60 focus:border-[#74866B] focus:bg-white transition-colors leading-relaxed resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                Tags (Comma separated)
              </label>
              <div className="relative flex items-center">
                <TagIcon className="w-3.5 h-3.5 text-[#858276] absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Habits, Leadership, Psychology, Finance"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-lg pl-9 pr-3 py-2 text-[#292820] placeholder:text-[#858276]/60 focus:border-[#74866B] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E9E5DC] flex items-center justify-between">
              <span className="text-xs text-[#858276] hidden sm:flex items-center gap-1">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#F1EEE6] text-[#292820] font-mono text-[10px]">
                  ⌘ + Enter
                </kbd>
                <span>to save</span>
              </span>

              <div className="flex items-center gap-2.5 ml-auto">
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
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-button bg-[#74866B] hover:bg-[#617258] text-white font-medium shadow-sm disabled:opacity-50 transition-colors"
                >
                  <CornerDownLeft className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting ? 'Saving...' : editNote ? 'Update Knowledge' : 'Save Knowledge'}
                  </span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
