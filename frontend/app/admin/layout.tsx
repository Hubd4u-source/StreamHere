"use client";
import React from 'react';
import AdminGuard from '@/components/AdminGuard';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-bg-base text-content-primary font-sans flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-bg-surface border-r border-border-subtle p-6 flex flex-col gap-8 md:min-h-screen sticky top-0">
           <Link href="/admin" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-bg-base font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-extrabold text-content-primary tracking-wide">
              ADMIN
            </span>
          </Link>

          <nav className="flex flex-col gap-2">
             <Link href="/admin" className="px-4 py-2 hover:bg-accent/10 rounded-xl transition-colors text-sm font-bold">Dashboard</Link>
             <Link href="/admin/content" className="px-4 py-2 hover:bg-accent/10 rounded-xl transition-colors text-sm font-bold">Content</Link>
             <Link href="/admin/settings" className="px-4 py-2 hover:bg-accent/10 rounded-xl transition-colors text-sm font-bold">Settings</Link>
             <Link href="/admin/users" className="px-4 py-2 hover:bg-accent/10 rounded-xl transition-colors text-sm font-bold text-content-tertiary cursor-not-allowed">Manage Users</Link>
             <div className="h-px bg-border-subtle my-2" />
             <Link href="/" className="px-4 py-2 hover:bg-accent/10 rounded-xl transition-colors text-sm font-medium text-content-tertiary">Back to Site</Link>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
