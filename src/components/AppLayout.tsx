'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { QuickCaptureModal } from './QuickCaptureModal';
import { AddBookModal } from './AddBookModal';
import { UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AppLayoutProps {
  user: UserProfile;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ user, children }) => {
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [addBookOpen, setAddBookOpen] = useState(false);
  const router = useRouter();

  // Listen to Cmd/Ctrl + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickCaptureOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#292820] flex flex-col md:flex-row">
      <Sidebar
        user={user}
        onOpenQuickCapture={() => setQuickCaptureOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 min-h-screen flex flex-col">
        <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          {children}
        </div>
      </main>

      {/* Global Quick Capture Modal */}
      <QuickCaptureModal
        isOpen={quickCaptureOpen}
        onClose={() => setQuickCaptureOpen(false)}
        onNoteCreated={() => router.refresh()}
      />

      {/* Global Add Book Modal */}
      <AddBookModal
        isOpen={addBookOpen}
        onClose={() => setAddBookOpen(false)}
        onBookAdded={() => router.refresh()}
      />
    </div>
  );
};
