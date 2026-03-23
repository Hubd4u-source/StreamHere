'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userDataService, UserProfile } from '@/lib/userDataService';
import NewNavbar from '@/components/NewNavbar';
import NewBottomNav from '@/components/NewBottomNav';
import DesktopNav from '@/components/DesktopNav';
import Link from 'next/link';
import { getRandomAnimeAvatar } from '@/lib/animeAvatars';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWatched: 0,
    totalInList: 0,
    watchingCount: 0,
    completedCount: 0,
    planToWatchCount: 0
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadUserStats();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const profile = await userDataService.getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;
    
    try {
      const userStats = await userDataService.getUserStats(user.uid);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <NewNavbar />
        <DesktopNav />
        
        <div className="max-w-screen-xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h1 className="text-3xl font-bold text-white mb-4">Profile</h1>
              <p className="text-gray-400 mb-8">Sign in to view your profile and statistics</p>
            </div>
            
            <button
              onClick={() => window.location.href = '/signin'}
              className="bg-accent text-bg-base font-black uppercase tracking-widest text-[13px] h-14 px-12 rounded-2xl hover:shadow-2xl hover:shadow-accent/40 active:scale-[0.98] transition-all duration-500 shadow-xl shadow-accent/20"
            >
              Sign In to Continue
            </button>
          </div>
        </div>

        <NewBottomNav />
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base font-sans mt-20 md:mt-0">
      <NewNavbar />
      <DesktopNav />
      
      <main className="w-full px-5 md:px-12 py-12 pb-32">
        {isLoading ? (
          <div className="space-y-10">
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-10 animate-pulse">
              <div className="flex items-center space-x-8">
                <div className="w-24 h-24 bg-bg-elevated rounded-full"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-bg-elevated rounded w-1/3"></div>
                  <div className="h-4 bg-bg-elevated rounded w-1/4"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-bg-surface border border-border-subtle rounded-2xl p-8 animate-pulse">
                  <div className="h-4 bg-bg-elevated rounded mb-4 w-1/2"></div>
                  <div className="h-10 bg-bg-elevated rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Profile Header */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-accent to-accent-muted rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <img
                    src={getRandomAnimeAvatar(user.uid)}
                    alt={user.displayName || 'User'}
                    className="relative w-24 h-24 rounded-full object-cover border-2 border-bg-surface shadow-2xl"
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-bg-surface rounded-full"></div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="space-y-1">
                    <h1 className="section-heading text-4xl">
                      {user.displayName || 'Anonymous User'}
                    </h1>
                    <p className="section-subtitle text-base">{user.email}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <span className="px-3 py-1 bg-bg-elevated border border-border-subtle rounded-full text-[11px] font-bold uppercase tracking-wider text-content-tertiary">
                      Member since {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Unknown'}
                    </span>
                    <span className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[11px] font-bold uppercase tracking-wider text-accent">
                      Premium Member
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <button
                    onClick={handleLogout}
                    className="px-6 h-11 border border-red-500/30 text-red-500 text-xs font-bold uppercase tracking-widest rounded-md hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-6">
              <h2 className="section-heading text-2xl">Your Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Total Watched', value: stats.totalWatched, sub: 'Episodes', icon: '📺' },
                  { label: 'My Collection', value: stats.totalInList, sub: 'Titles', icon: '📚' },
                  { label: 'Currently Watching', value: stats.watchingCount, sub: 'Active', icon: '🔥' },
                  { label: 'Completed', value: stats.completedCount, sub: 'Finished', icon: '🏆' },
                  { label: 'Plan to Watch', value: stats.planToWatchCount, sub: 'Saved', icon: '⏳' },
                  { label: 'Account Rank', value: 'S-Rank', sub: 'Viewer', icon: '⭐' }
                ].map((stat, i) => (
                  <div key={i} className="bg-bg-surface border border-border-subtle rounded-xl p-8 space-y-4 group hover:border-accent-muted transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-content-tertiary text-xs font-bold uppercase tracking-widest">{stat.label}</span>
                      <span className="text-2xl group-hover:scale-125 transition-transform duration-500">{stat.icon}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-4xl font-serif text-accent group-hover:text-content-primary transition-colors">
                        {stat.value}
                      </div>
                      <div className="text-[11px] text-content-tertiary font-medium uppercase tracking-tighter">
                        {stat.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <h2 className="section-heading text-2xl">Quick Access</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Link
                  href="/my-list"
                  className="group bg-bg-surface border border-border-subtle p-8 rounded-xl text-center space-y-4 hover:border-accent transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg-base transition-all duration-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-content-primary font-bold text-lg">My Favorites</h3>
                    <p className="text-content-tertiary text-sm">Your curated collection</p>
                  </div>
                </Link>

                <Link
                  href="/watch-history"
                   className="group bg-bg-surface border border-border-subtle p-8 rounded-xl text-center space-y-4 hover:border-accent transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg-base transition-all duration-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-content-primary font-bold text-lg">Watch History</h3>
                    <p className="text-content-tertiary text-sm">Resume where you left off</p>
                  </div>
                </Link>

                <Link
                  href="/"
                   className="group bg-bg-surface border border-border-subtle p-8 rounded-xl text-center space-y-4 hover:border-accent transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5"
                >
                   <div className="w-16 h-16 mx-auto rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg-base transition-all duration-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-content-primary font-bold text-lg">Explore Library</h3>
                    <p className="text-content-tertiary text-sm">Find new stories to watch</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <NewBottomNav />
    </div>
  );
}
