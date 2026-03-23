'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userDataService, UserProfile, RANKS } from '@/lib/userDataService';
import NewNavbar from '@/components/NewNavbar';
import NewBottomNav from '@/components/NewBottomNav';
import DesktopNav from '@/components/DesktopNav';
import Link from 'next/link';
import { getRandomAnimeAvatar } from '@/lib/animeAvatars';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const [profile, userStats] = await Promise.all([
        userDataService.getUserProfile(user.uid),
        userDataService.getUserStats(user.uid)
      ]);
      setUserProfile(profile);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user && !isLoading) {
    return (
      <div className="min-h-screen bg-bg-base">
        <NewNavbar />
        <DesktopNav />
        <div className="max-w-screen-xl mx-auto px-4 py-32 text-center space-y-8">
          <div className="w-24 h-24 bg-bg-surface border border-border-subtle rounded-full flex items-center justify-center mx-auto text-content-tertiary">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <div className="space-y-4">
            <h1 className="section-heading text-4xl">Your Profile</h1>
            <p className="section-subtitle text-lg">Sign in to track your stats and unlock ranks</p>
          </div>
          <Link href="/signin" className="btn-primary inline-flex px-12 h-14 items-center rounded-2xl shadow-2xl shadow-accent/20">
            Sign In to Continue
          </Link>
        </div>
        <NewBottomNav />
      </div>
    );
  }

  const rankInfo = stats ? userDataService.calculateRank(stats.xp) : null;

  return (
    <div className="min-h-screen bg-bg-base font-sans selection:bg-accent/30 selection:text-white pb-32">
      <NewNavbar />
      <DesktopNav />
      
      <main className="max-w-[1200px] mx-auto px-6 py-12 space-y-16 pt-24 md:pt-12">
        {isLoading ? (
          <div className="animate-pulse space-y-12">
            <div className="h-64 bg-bg-surface border border-border-subtle rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="h-40 bg-bg-surface border border-border-subtle rounded-3xl" />
              <div className="h-40 bg-bg-surface border border-border-subtle rounded-3xl" />
              <div className="h-40 bg-bg-surface border border-border-subtle rounded-3xl" />
            </div>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="relative bg-bg-surface border border-border-subtle p-8 md:p-12 rounded-[40px] overflow-hidden group">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative flex flex-col md:flex-row items-center md:items-start gap-12">
                {/* Avatar & Rank Plate */}
                <div className="relative shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 p-1.5 rounded-[40px] bg-gradient-to-br from-accent to-accent-muted/20 shadow-2xl">
                    <img
                      src={getRandomAnimeAvatar(user.uid)}
                      alt={user.displayName || 'User'}
                      className="w-full h-full rounded-[35px] object-cover border-4 border-bg-surface shadow-inner"
                    />
                  </div>
                  <div 
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full border border-white/10 shadow-xl backdrop-blur-xl flex items-center gap-2 whitespace-nowrap"
                    style={{ backgroundColor: `${rankInfo?.color}20`, borderColor: `${rankInfo?.color}40` }}
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90">Rank</span>
                    <span className="text-[12px] font-bold text-white uppercase" style={{ color: rankInfo?.color }}>
                      {rankInfo?.name || 'Newbie'}
                    </span>
                  </div>
                </div>

                {/* Info & Progress */}
                <div className="flex-1 text-center md:text-left space-y-8 w-full">
                  <div className="space-y-2">
                    <h1 className="section-heading text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
                      {user.displayName || 'Anime Legend'}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      <span className="text-content-tertiary text-sm font-medium tracking-wide">{user.email}</span>
                      <span className="w-1.5 h-1.5 bg-border-subtle rounded-full hidden md:block" />
                      <span className="text-accent text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
                         {userProfile?.stats?.episodesCompleted || 0} Finished
                      </span>
                    </div>
                  </div>

                  {/* XP Progress Bar */}
                  <div className="space-y-4 max-w-xl mx-auto md:mx-0">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-content-tertiary">Current XP</div>
                        <div className="text-2xl font-serif text-accent">{Math.round(stats?.xp || 0).toLocaleString()}</div>
                      </div>
                      {rankInfo?.nextRank && (
                        <div className="text-right space-y-1">
                          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-content-tertiary">Next: {rankInfo.nextRank.name}</div>
                          <div className="text-xs font-bold text-content-secondary">
                            {(rankInfo.nextRank.minXP - Math.round(stats?.xp || 0)).toLocaleString()} XP to go
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="h-3 w-full bg-bg-base/50 rounded-full overflow-hidden border border-border-subtle/30 shadow-inner">
                      <div 
                        className="h-full bg-accent shadow-[0_0_20px_var(--accent)] transition-all duration-1000 ease-out relative"
                        style={{ width: `${Math.round(rankInfo?.progressToNext || 0)}%`, backgroundColor: rankInfo?.color }}
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex md:flex-col gap-4">
                   <button
                    onClick={handleLogout}
                    className="h-14 px-8 border border-red-500/20 text-red-500 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-500"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Total Time', value: `${Math.round((stats?.totalMinutesWatched || 0) / 60)}h ${Math.round((stats?.totalMinutesWatched || 0) % 60)}m`, sub: 'Watch Time', icon: '⏱️' },
                { label: 'In Library', value: stats?.totalInList || 0, sub: 'Saved Titles', icon: '🔖' },
                { label: 'Currently', value: stats?.watchingCount || 0, sub: 'Active Shows', icon: '📺' },
                { label: 'Finished', value: stats?.completedCount || 0, sub: 'Binge Sessions', icon: '🎖️' }
              ].map((s, idx) => (
                <div key={idx} className="bg-bg-surface border border-border-subtle p-8 rounded-[32px] space-y-4 hover:border-accent/40 transition-all duration-500 hover:-translate-y-1 shadow-xl hover:shadow-accent/5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-content-tertiary leading-none">{s.label}</span>
                    <span className="text-2xl">{s.icon}</span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-4xl font-serif text-content-primary">{s.value}</div>
                    <div className="text-[11px] font-bold text-content-tertiary uppercase tracking-wider">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rank List Section */}
            <div className="space-y-8">
              <h2 className="section-heading text-3xl">Rank Progression</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {RANKS.map((r) => {
                  const isUnlocked = (stats?.xp || 0) >= r.minXP;
                  const isCurrent = rankInfo?.name === r.name;
                  return (
                    <div 
                      key={r.name} 
                      className={`p-6 rounded-3xl border text-center space-y-3 transition-all duration-500 ${isUnlocked ? 'bg-bg-surface border-border-subtle opacity-100' : 'bg-transparent border-border-subtle/10 opacity-30'} ${isCurrent ? 'ring-2 ring-accent ring-offset-4 ring-offset-bg-base' : ''}`}
                    >
                      <div 
                        className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl shadow-lg"
                        style={{ backgroundColor: isUnlocked ? `${r.color}20` : '#1a1a1a', color: r.color }}
                      >
                         {isUnlocked ? '✨' : '🔒'}
                      </div>
                      <div className="space-y-1">
                        <div className={`text-[11px] font-black uppercase tracking-widest ${isUnlocked ? 'text-content-primary' : 'text-content-tertiary'}`}>{r.name}</div>
                        <div className="text-[10px] font-bold text-content-tertiary tracking-tighter">{r.minXP.toLocaleString()} XP</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>

      <NewBottomNav />
    </div>
  );
}
