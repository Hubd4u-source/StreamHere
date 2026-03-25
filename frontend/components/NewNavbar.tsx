"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { UserProfile } from './auth/UserProfile';

export default function NewNavbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Links moved to DesktopNav/NewBottomNav to avoid redundancy

  return (
    <header className="sticky top-0 z-50 bg-bg-surface border-b border-border-subtle h-16">
      <div className="max-w-[1280px] mx-auto px-12 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 relative flex-shrink-0 rounded-xl overflow-hidden shadow-lg shadow-accent/10 border border-accent/20 transition-transform group-hover:scale-110">
              <Image
                src="/android-chrome-192x192.png"
                alt="AMAI TV"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-2xl font-black text-content-primary tracking-tighter group-hover:text-accent transition-colors">
              AMAI <span className="text-accent underline decoration-accent/30 underline-offset-4">TV</span>
            </span>
          </Link>

          {/* Desktop Navigation - Removed to avoid "Double" nav (Now in DesktopNav bottom bar) */}

          {/* Search and Actions */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search anime..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 px-4 py-2 bg-bg-elevated border border-border-subtle rounded-md text-content-primary placeholder-content-tertiary focus:outline-none focus:border-border-medium transition-colors"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="btn btn-primary h-10 px-4"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-content-tertiary hover:text-content-primary transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-content-tertiary hover:text-content-primary transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}
            </div>

            {/* User Actions - Managed exclusively via UserProfile component */}
            <div className="flex items-center">
              <UserProfile />
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-content-tertiary hover:text-content-primary transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
