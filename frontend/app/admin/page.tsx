"use client";
import React, { useState, useEffect } from 'react';
import { userDataService } from '@/lib/userDataService';
import { settingsService, SiteSettings } from '@/lib/settingsService';
import { animeCacheService } from '@/lib/animeCacheService';
import Link from 'next/link';

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState<number>(0);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [contentCount, setContentCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [count, s, allCached] = await Promise.all([
          userDataService.getAllUsersCount(),
          settingsService.getSettings(),
          animeCacheService.getAllCached(5000)
        ]);
        setUserCount(count);
        setSettings(s);
        setContentCount(allCached.length);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-content-tertiary animate-pulse font-bold tracking-widest uppercase text-xs">Loading analytics...</div>
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-content-primary">Admin Dashboard</h1>
        <p className="text-content-tertiary">Real-time site health and content statistics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Stats Card */}
        <div className="p-8 bg-bg-surface border border-border-subtle rounded-[2.5rem] space-y-4 shadow-xl shadow-black/20 group hover:border-accent/50 transition-colors">
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent text-2xl group-hover:scale-110 transition-transform">
             👥
          </div>
          <div>
            <p className="text-content-tertiary text-[10px] font-black uppercase tracking-[0.2em]">Total Users</p>
            <h2 className="text-4xl font-extrabold text-content-primary">{userCount}</h2>
          </div>
        </div>

        {/* Content Stats Card */}
        <Link href="/admin/content" className="p-8 bg-bg-surface border border-border-subtle rounded-[2.5rem] space-y-4 shadow-xl shadow-black/20 group hover:border-accent border-subtle transition-all active:scale-95">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 text-2xl group-hover:scale-110 transition-transform">
               📁
            </div>
            <span className="text-[10px] font-black text-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Manage ↗</span>
          </div>
          <div>
            <p className="text-content-tertiary text-[10px] font-black uppercase tracking-[0.2em]">Cached Animes</p>
            <h2 className="text-4xl font-extrabold text-content-primary">{contentCount}</h2>
          </div>
        </Link>

        {/* Feature Status Card */}
        <div className="p-8 bg-bg-surface border border-border-subtle rounded-[2.5rem] space-y-4 shadow-xl shadow-black/20">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 text-2xl">
             ⚡
          </div>
          <div className="space-y-2">
             <p className="text-content-tertiary text-[10px] font-black uppercase tracking-[0.2em]">Features Status</p>
             <div className="flex flex-col gap-1 text-sm font-bold">
                <div className="flex justify-between">
                   <span className="text-content-secondary">Schedule</span>
                   <span className={settings?.hide_schedule ? "text-red-500" : "text-green-500"}>
                     {settings?.hide_schedule ? "Offline" : "Live"}
                   </span>
                </div>
                <div className="flex justify-between">
                   <span className="text-content-secondary">Upcoming</span>
                   <span className={settings?.hide_upcoming ? "text-red-500" : "text-green-500"}>
                     {settings?.hide_upcoming ? "Offline" : "Live"}
                   </span>
                </div>
             </div>
          </div>
        </div>

        {/* Configuration Status Card */}
        <div className="p-8 bg-bg-surface border border-border-subtle rounded-[2.5rem] space-y-4 shadow-xl shadow-black/20">
          <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 text-2xl">
             🔌
          </div>
          <div className="space-y-2 overflow-hidden">
             <p className="text-content-tertiary text-[10px] font-black uppercase tracking-[0.2em]">API Gateway</p>
             <div className="text-xs truncate font-mono text-content-secondary bg-bg-elevated p-2 rounded-lg border border-border-subtle/50">
                {settings?.site_base?.replace('https://', '') || "Default Sources"}
             </div>
          </div>
        </div>
      </div>
      
      <div className="p-8 bg-accent/5 border border-accent/20 rounded-[2.5rem] backdrop-blur-sm">
         <div className="flex items-center gap-4">
            <span className="text-2xl animate-bounce">💡</span>
            <p className="text-content-primary text-sm font-black uppercase tracking-wider">
               Pro Tip: <span className="text-content-tertiary normal-case font-medium">You can now manually override anime titles and descriptions in the </span>
               <Link href="/admin/content" className="text-accent underline decoration-2 underline-offset-4">Content Manager</Link>.
            </p>
         </div>
      </div>
    </div>
  );
}
