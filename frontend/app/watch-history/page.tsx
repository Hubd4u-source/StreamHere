'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import NewNavbar from '@/components/NewNavbar';
import NewBottomNav from '@/components/NewBottomNav';
import DesktopNav from '@/components/DesktopNav';
import Link from 'next/link';
import Image from 'next/image';

export default function WatchHistoryPage() {
  const { user } = useAuth();
  const { watchHistory, isLoading, clearWatchHistory } = useWatchHistory();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearHistory = async () => {
    try {
      await clearWatchHistory();
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Error clearing watch history:', error);
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-3xl font-bold text-white mb-4">Watch History</h1>
              <p className="text-gray-400 mb-8">Sign in to track your anime watching progress</p>
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
    <div className="min-h-screen bg-bg-base font-sans">
      <NewNavbar />
      <DesktopNav />
      
      <main className="w-full px-5 md:px-12 py-12 pb-32">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-4">
              <h1 className="section-heading text-4xl">Watch History</h1>
              <p className="section-subtitle">
                You've watched {watchHistory.length} episodes recently
              </p>
            </div>
            
            {watchHistory.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-6 h-11 border border-red-500/30 text-red-500 text-sm font-bold uppercase tracking-widest rounded-md hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                Clear History
              </button>
            )}
          </div>
        </div>

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-bg-surface p-8 rounded-md border border-border-subtle max-w-md w-full space-y-6">
              <div className="space-y-2">
                <h3 className="section-heading text-2xl">Wait a moment</h3>
                <p className="section-subtitle">
                  Are you sure you want to clear your entire watch history? This action cannot be undone and will reset your progress.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleClearHistory}
                  className="flex-1 h-12 bg-red-600 text-white rounded-md font-bold text-sm uppercase tracking-widest hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 h-12 bg-bg-elevated border border-border-subtle text-content-primary rounded-md font-bold text-sm uppercase tracking-widest hover:bg-border-subtle transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12">
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex gap-6 p-4 bg-bg-surface border border-border-subtle rounded-md animate-pulse">
                  <div className="w-40 aspect-video bg-bg-elevated rounded"></div>
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-4 bg-bg-elevated rounded w-1/3"></div>
                    <div className="h-3 bg-bg-elevated rounded w-1/4"></div>
                    <div className="h-2 bg-bg-elevated rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : watchHistory.length === 0 ? (
            <div className="text-center py-24 space-y-6 bg-bg-surface border border-border-subtle rounded-md">
              <div className="w-20 h-20 mx-auto text-content-tertiary opacity-20">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="section-heading text-2xl">Your history is clear</h3>
                <p className="section-subtitle max-w-xs mx-auto">
                  Start watching your favorite anime and we'll keep track of your progress right here.
                </p>
              </div>
              <Link href="/" className="btn-primary inline-flex px-8 h-12 items-center">
                Start Watching
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {watchHistory.map((item, index) => (
                <Link
                  key={`${item.id}-${index}`}
                  href={item.url}
                  className="group block p-4 bg-bg-surface border border-border-subtle rounded-md hover:border-accent-muted transition-colors focus:outline-none"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="relative flex-shrink-0 w-full sm:w-48 aspect-video rounded-sm overflow-hidden bg-bg-elevated border border-border-subtle">
                      {item.poster ? (
                        <Image
                          unoptimized
                          src={item.poster.startsWith('data:') ? item.poster : `/api/image?src=${encodeURIComponent(item.poster)}`}
                          alt={item.title}
                          fill
                          className="object-cover transition-opacity duration-300 group-hover:opacity-80"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-content-tertiary text-xs">NO PREVIEW</div>
                      )}
                      
                      {/* Progress Bar */}
                      {item.progress && item.progress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                          <div 
                            className="h-full bg-accent transition-all duration-300" 
                            style={{ width: `${item.progress}%` }} 
                          />
                        </div>
                      )}

                      {/* Hover Play Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                          <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 py-1 space-y-2">
                      <div className="space-y-1">
                        <h3 className="text-content-primary font-medium text-lg leading-tight transition-colors group-hover:text-accent">
                          {item.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-content-tertiary text-xs font-medium">
                          <span className="text-accent">Episode {item.episode}</span>
                          {item.season && <span>Season {item.season}</span>}
                          <span className="opacity-30">•</span>
                          <span>{new Date(item.watchedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {item.progress && (
                        <div className="text-[11px] text-content-tertiary font-bold uppercase tracking-wider">
                          {Math.round(item.progress)}% completed
                        </div>
                      )}
                    </div>
                    
                    <div className="hidden sm:flex items-center pr-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-content-tertiary group-hover:text-accent group-hover:bg-accent/10 transition-all duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <NewBottomNav />
    </div>
  );
}
