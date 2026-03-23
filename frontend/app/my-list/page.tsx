'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMyList } from '@/hooks/useMyList';
import { MyListItem } from '@/lib/userDataService';
import NewNavbar from '@/components/NewNavbar';
import NewBottomNav from '@/components/NewBottomNav';
import DesktopNav from '@/components/DesktopNav';
import Link from 'next/link';
import Image from 'next/image';
import { generateSlug } from '@/lib/utils';

export default function MyListPage() {
  const { user } = useAuth();
  const { myList, isLoading, loadMyList } = useMyList();
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'plan-to-watch', label: 'Plan to Watch' },
    { value: 'watching', label: 'Watching' },
    { value: 'completed', label: 'Completed' },
    { value: 'dropped', label: 'Dropped' }
  ];

  const getStatusColor = (status: MyListItem['status']) => {
    switch (status) {
      case 'watching':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'plan-to-watch':
        return 'bg-accent/20 text-accent border-accent/30';
      case 'dropped':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-content-tertiary/20 text-content-tertiary border-content-tertiary/30';
    }
  };

  const getStatusText = (status: MyListItem['status']) => {
    switch (status) {
      case 'watching':
        return 'Watching';
      case 'completed':
        return 'Completed';
      case 'plan-to-watch':
        return 'Plan to Watch';
      case 'dropped':
        return 'Dropped';
      default:
        return 'Unknown';
    }
  };

  useEffect(() => {
    if (user) {
      loadMyList(selectedStatus);
    }
  }, [user, selectedStatus]);

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-base font-sans transition-colors duration-500">
        <NewNavbar />
        <DesktopNav />
        
        <main className="w-full px-5 md:px-12 py-32 pb-40">
          <div className="text-center space-y-8 max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto text-content-tertiary opacity-20">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            
            <div className="space-y-4">
              <h1 className="section-heading text-4xl">My List</h1>
              <p className="section-subtitle">Sign in to save your favorite anime, track your progress, and get personalized recommendations.</p>
            </div>
            
            <Link
              href="/signin"
              className="bg-accent text-bg-base font-black uppercase tracking-widest text-[13px] h-14 px-12 rounded-2xl hover:shadow-2xl hover:shadow-accent/40 active:scale-[0.98] transition-all duration-500 shadow-xl shadow-accent/20 flex items-center justify-center"
            >
              Sign In to Continue
            </Link>
          </div>
        </main>

        <NewBottomNav />
      </div>
    );
  }

  const filteredList = selectedStatus ? myList.filter(item => item.status === selectedStatus) : myList;

  return (
    <div className="min-h-screen bg-bg-base font-sans">
      <NewNavbar />
      <DesktopNav />
      
      <main className="w-full px-5 md:px-12 py-12 pb-32">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="section-heading text-4xl">My List</h1>
            <p className="section-subtitle">
              You have {filteredList.length} {selectedStatus ? getStatusText(selectedStatus as MyListItem['status']) : 'total'} anime in your collection
            </p>
          </div>
          
          {/* Status Filter */}
          <div className="flex flex-wrap gap-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-5 h-10 rounded-full text-[13px] font-medium transition-all duration-200 border ${
                  selectedStatus === option.value
                    ? 'bg-accent border-accent text-bg-base'
                    : 'bg-bg-surface border-border-subtle text-content-secondary hover:border-border-medium hover:text-content-primary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="space-y-4 animate-pulse">
                  <div className="aspect-[2/3] bg-bg-surface border border-border-subtle rounded-md"></div>
                  <div className="h-4 bg-bg-surface rounded w-3/4"></div>
                  <div className="h-3 bg-bg-surface rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-24 space-y-6 bg-bg-surface border border-border-subtle rounded-md">
              <div className="w-20 h-20 mx-auto text-content-tertiary opacity-20">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="section-heading text-2xl">Your list is empty</h3>
                <p className="section-subtitle max-w-xs mx-auto">
                  {selectedStatus 
                    ? `No anime matches the status "${getStatusText(selectedStatus as MyListItem['status'])}"`
                    : 'Explore our library and add your favorites to your personal collection'
                  }
                </p>
              </div>
              <Link href="/" className="btn-primary inline-flex px-8 h-12 items-center">
                Browse Library
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredList.map((item) => (
                <Link
                  key={item.id}
                  href={`/title/${generateSlug(item.title)}`}
                  className="group block space-y-3 focus:outline-none"
                >
                  <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-bg-surface border border-border-subtle shadow-md transition-all duration-300 group-hover:border-border-medium group-hover:shadow-xl">
                    {item.poster ? (
                      <Image
                        unoptimized
                        src={item.poster.startsWith('data:') ? item.poster : `/api/image?src=${encodeURIComponent(item.poster)}`}
                        alt={item.title}
                        fill
                        className="object-cover transition-opacity duration-300 group-hover:opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-content-tertiary text-xs">NO POSTER</div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm backdrop-blur-md border ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </div>
                    
                    {/* Rating Badge */}
                    {item.rating && (
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-bg-base/80 backdrop-blur-md text-accent px-2 py-1 text-[10px] font-bold rounded-sm border border-white/5 ring-1 ring-white/10">
                          ⭐ {item.rating}
                        </span>
                      </div>
                    )}

                    {/* Hover Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                        <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-content-primary font-medium text-[13px] leading-snug line-clamp-2 transition-colors group-hover:text-accent">
                      {item.title}
                    </h3>
                    <div className="text-content-tertiary text-[11px]">
                      Added {new Date(item.addedAt).toLocaleDateString()}
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
