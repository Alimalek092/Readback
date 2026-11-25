'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  Library,
  FileText,
  RotateCw,
  BarChart3,
  Settings,
  Plus,
  LogOut,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface SidebarProps {
  user: UserProfile;
  onOpenQuickCapture: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onOpenQuickCapture }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const navItems = [
    { label: 'Home', href: '/app', icon: BookOpen },
    { label: 'My Library', href: '/app/library', icon: Library },
    { label: 'My Notes', href: '/app/notes', icon: FileText },
    { label: 'Remember Today', href: '/app/review', icon: RotateCw, badge: 'Due' },
    { label: 'Insights', href: '/app/insights', icon: BarChart3 },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
      setIsLoggingOut(false);
    }
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between p-5 bg-[#F8F6F0] border-r border-[#E9E5DC]">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/app" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#74866B] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#292820]">
                ReadBack
              </span>
              <p className="text-[10px] text-[#858276] uppercase tracking-wider font-mono">
                Knowledge Space
              </p>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 text-[#858276] hover:text-[#292820]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action Button: Quick Capture */}
        <button
          onClick={() => {
            onOpenQuickCapture();
            setMobileMenuOpen(false);
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-sm font-medium shadow-sm transition-all duration-200 mb-6 group"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          <span>Capture an idea</span>
          <kbd className="hidden lg:inline-block ml-auto text-[10px] bg-black/15 px-1.5 py-0.5 rounded text-white/90">
            ⌘K
          </kbd>
        </button>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/app'
                ? pathname === '/app'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#E7EDE2] text-[#475A40] font-semibold'
                    : 'text-[#56544D] hover:bg-[#F1EEE6] hover:text-[#292820]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#74866B]' : 'text-[#858276]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.label === 'Remember Today' && (
                  <span className="w-2 h-2 rounded-full bg-[#74866B] animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-5 border-t border-[#E9E5DC]" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          <Link
            href="/app/settings"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname.startsWith('/app/settings')
                ? 'bg-[#E7EDE2] text-[#475A40] font-semibold'
                : 'text-[#56544D] hover:bg-[#F1EEE6] hover:text-[#292820]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#858276]" />
            <span>Settings</span>
          </Link>

          <Link
            href="/pricing"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#74866B] bg-[#E7EDE2]/60 hover:bg-[#E7EDE2] transition-colors mt-2"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#74866B]" />
              <span>Plus Membership</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white border border-[#E9E5DC]">
              Upgrade
            </span>
          </Link>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="pt-4 border-t border-[#E9E5DC]">
        <div className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-[#F1EEE6] transition-colors">
          <Link href="/app/settings/profile" className="flex items-center gap-2.5 min-w-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-8 h-8 rounded-full object-cover border border-[#E9E5DC]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#E7EDE2] text-[#475A40] flex items-center justify-center text-xs font-semibold">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#292820] truncate">
                {user.displayName}
              </p>
              <p className="text-[11px] text-[#858276] truncate">
                {user.email || user.phone || 'Personal Library'}
              </p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Log out"
            className="p-1.5 text-[#858276] hover:text-[#B96C64] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 h-screen fixed left-0 top-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#F8F6F0] border-b border-[#E9E5DC]">
        <Link href="/app" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#74866B] flex items-center justify-center text-white">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span className="font-serif text-lg font-bold text-[#292820]">ReadBack</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQuickCapture}
            className="p-2 rounded-md bg-[#74866B] text-white text-xs font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Capture</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-[#292820] rounded-md hover:bg-[#F1EEE6]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-[#F8F6F0] h-full shadow-2xl z-10">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
