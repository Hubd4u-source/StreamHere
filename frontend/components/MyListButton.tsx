'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userDataService, MyListItem } from '@/lib/userDataService';

interface MyListButtonProps {
  animeId: string;
  animeTitle: string;
  animePoster?: string;
  animeUrl: string;
  className?: string;
}

export const MyListButton: React.FC<MyListButtonProps> = ({
  animeId,
  animeTitle,
  animePoster,
  animeUrl,
  className = ''
}) => {
  const { user } = useAuth();
  const [isInList, setIsInList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<MyListItem['status']>('plan-to-watch');

  useEffect(() => {
    if (user) {
      checkIfInList();
    }
  }, [user, animeId]);

  const checkIfInList = async () => {
    if (!user) return;
    
    try {
      const inList = await userDataService.isInMyList(user.uid, animeId);
      setIsInList(inList);
      
      if (inList) {
        const myList = await userDataService.getMyList(user.uid);
        const item = myList.find(item => item.id === animeId);
        if (item) {
          setCurrentStatus(item.status);
        }
      }
    } catch (error) {
      console.error('Error checking if in list:', error);
    }
  };

  const handleToggleList = async () => {
    if (!user) {
      window.location.href = '/signin';
      return;
    }

    try {
      setIsLoading(true);
      
      if (isInList) {
        await userDataService.removeFromMyList(user.uid, animeId);
        setIsInList(false);
      } else {
        await userDataService.addToMyList(user.uid, {
          id: animeId,
          title: animeTitle,
          poster: animePoster,
          url: animeUrl,
          status: 'plan-to-watch'
        });
        setIsInList(true);
        setCurrentStatus('plan-to-watch');
      }
    } catch (error) {
      console.error('Error toggling list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: MyListItem['status']) => {
    if (!user || !isInList) return;

    try {
      setIsLoading(true);
      await userDataService.updateMyListItem(user.uid, animeId, { status: newStatus });
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: MyListItem['status']) => {
    switch (status) {
      case 'watching':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'plan-to-watch':
        return 'bg-content-tertiary/10 text-content-tertiary border-content-tertiary/20';
      case 'dropped':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-bg-elevated text-content-tertiary border-border-subtle';
    }
  };

  const getStatusText = (status: MyListItem['status']) => {
    switch (status) {
      case 'watching': return 'Watching';
      case 'completed': return 'Completed';
      case 'plan-to-watch': return 'Plan to Watch';
      case 'dropped': return 'Dropped';
      default: return 'Unknown';
    }
  };

  return (
    <>
      <div className={`relative ${className}`}>
        {isInList ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleList}
              disabled={isLoading}
              className="group flex items-center justify-center w-12 h-12 bg-bg-surface border border-red-500/30 text-red-500 rounded-xl transition-all duration-500 hover:bg-red-500 hover:text-white hover:shadow-2xl hover:shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              title={isLoading ? 'Removing...' : 'Remove from List'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <div className="relative">
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value as MyListItem['status'])}
                disabled={isLoading}
                className={`h-12 pl-4 pr-10 rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/40 border transition-all duration-500 appearance-none bg-bg-surface ${getStatusColor(currentStatus)} disabled:cursor-not-allowed`}
              >
                <option value="plan-to-watch">Plan to Watch</option>
                <option value="watching">Watching</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={handleToggleList}
            disabled={isLoading}
            className="btn-outline h-12 min-w-[160px] flex items-center justify-center gap-2 group hover:border-accent/40 rounded-xl px-6 transition-all duration-500"
          >
            <div className="relative">
              <svg className="w-5 h-5 transition-transform duration-500 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {isLoading ? 'Adding...' : 'Add to Collection'}
            </span>
          </button>
        )}
      </div>
    </>
  );
}
