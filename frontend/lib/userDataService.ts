import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  serverTimestamp,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  increment
} from 'firebase/firestore';
import { db } from './firebase';

export interface WatchHistoryItem {
  id: string;
  title: string;
  episode: string;
  season?: string;
  poster?: string;
  url: string;
  watchedAt: number; // Use number for consistency
  progress?: number; // 0-100 percentage
  duration?: number; // total duration in seconds
}

export interface MyListItem {
  id: string;
  title: string;
  poster?: string;
  url: string;
  addedAt: number;
  status: 'watching' | 'completed' | 'plan-to-watch' | 'dropped';
  rating?: number; // 1-10
  notes?: string;
}

export interface UserStats {
  xp: number;
  rank: string;
  level: number;
  totalMinutesWatched: number;
  episodesCompleted: number;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  createdAt: any;
  lastLoginAt: any;
  stats: UserStats;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
  };
}

export const RANKS = [
  { name: 'Newbie', minXP: 0, color: '#94a3b8' },          // Slate 400
  { name: 'Apprentice', minXP: 1000, color: '#4ade80' },    // Green 400
  { name: 'Watcher', minXP: 5000, color: '#60a5fa' },       // Blue 400
  { name: 'Otaku', minXP: 15000, color: '#f472b6' },        // Pink 400
  { name: 'Elite Watcher', minXP: 30000, color: '#fb923c' }, // Orange 400
  { name: 'Anime Master', minXP: 60000, color: '#a855f7' },  // Purple 500
  { name: 'Legend', minXP: 120000, color: '#facc15' },      // Yellow 400
  { name: 'Mythic', minXP: 250000, color: '#f87171' },      // Red 400
  { name: 'Celestial', minXP: 500000, color: '#2dd4bf' },   // Teal 400
  { name: 'Amai Overlord', minXP: 1000000, color: '#ffffff' } // White
];

class UserDataService {
  private getUserDocRef(uid: string) {
    return doc(db, 'users', uid);
  }

  private getWatchHistoryRef(uid: string) {
    return doc(db, 'users', uid, 'data', 'watchHistory');
  }

  private getMyListRef(uid: string) {
    return doc(db, 'users', uid, 'data', 'myList');
  }

  public calculateRank(xp: number) {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (xp >= RANKS[i].minXP) {
        return {
          ...RANKS[i],
          nextRank: RANKS[i+1] || null,
          progressToNext: RANKS[i+1] 
            ? ((xp - RANKS[i].minXP) / (RANKS[i+1].minXP - RANKS[i].minXP)) * 100 
            : 100
        };
      }
    }
    return { ...RANKS[0], nextRank: RANKS[1], progressToNext: 0 };
  }

  // User Profile Management
  async ensureUserProfile(uid: string, email: string | null, displayName: string | null, photoURL?: string | null): Promise<void> {
    const userRef = this.getUserDocRef(uid);
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      console.log(`UserDataService: Creating initial profile for ${uid}`);
      const userProfile: UserProfile = {
        uid,
        email,
        displayName: displayName || 'Anime Legend',
        photoURL: photoURL || null,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        stats: {
          xp: 0,
          rank: 'Newbie',
          level: 1,
          totalMinutesWatched: 0,
          episodesCompleted: 0
        },
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: true
        }
      };
      await setDoc(userRef, userProfile);
    } else {
      const data = docSnap.data() as UserProfile;
      if (!data.stats) {
        console.log(`UserDataService: Migrating legacy user ${uid} to stats system`);
        await updateDoc(userRef, {
          stats: {
            xp: 0,
            rank: 'Newbie',
            level: 1,
            totalMinutesWatched: 0,
            episodesCompleted: 0
          }
        });
      }
    }
  }

  async createUserProfile(user: any): Promise<void> {
    await this.ensureUserProfile(user.uid, user.email, user.displayName, user.photoURL);
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docRef = this.getUserDocRef(uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  }

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const docRef = this.getUserDocRef(uid);
    await updateDoc(docRef, {
      ...updates,
      lastLoginAt: Date.now()
    });
  }

  // Watch History Management
  async addToWatchHistory(uid: string, item: Omit<WatchHistoryItem, 'watchedAt'>): Promise<void> {
    const historyRef = this.getWatchHistoryRef(uid);
    const historyItem: WatchHistoryItem = {
      ...item,
      watchedAt: Date.now()
    };

    const docSnap = await getDoc(historyRef);
    let history: WatchHistoryItem[] = [];
    
    if (docSnap.exists()) {
      history = docSnap.data().items || [];
    }

    // Move to top and update data
    history = history.filter(h => h.id !== item.id);
    history.unshift(historyItem);

    if (history.length > 50) {
      history = history.slice(0, 50);
    }

    await setDoc(historyRef, { items: history });
  }

  async getWatchHistory(uid: string, limitCount: number = 24): Promise<WatchHistoryItem[]> {
    const historyRef = this.getWatchHistoryRef(uid);
    const docSnap = await getDoc(historyRef);
    
    if (docSnap.exists()) {
      const history = docSnap.data().items || [];
      return history.slice(0, limitCount);
    }
    return [];
  }

  async updateWatchProgress(
    uid: string, 
    itemId: string, 
    progress: number, 
    durationSeconds: number, 
    fallbackData?: Omit<WatchHistoryItem, 'watchedAt' | 'progress' | 'duration'>,
    isHeartbeat: boolean = false
  ): Promise<void> {
    const historyRef = this.getWatchHistoryRef(uid);
    const docSnap = await getDoc(historyRef);
    
    let history: WatchHistoryItem[] = [];
    if (docSnap.exists()) {
      history = docSnap.data().items || [];
    }
    
    let itemIndex = history.findIndex(item => item.id === itemId);
    
    // If it's a heartbeat, we just want to grant XP and update the "watchedAt" timestamp
    if (isHeartbeat) {
      console.log(`UserDataService: Heartbeat for ${itemId}. Granting 5 XP.`);
      await this.addXP(uid, 5, 0.5); // 5 XP, 0.5 minutes (30s)
      
      if (itemIndex !== -1) {
        history[itemIndex].watchedAt = Date.now();
        const updatedItem = history.splice(itemIndex, 1)[0];
        history.unshift(updatedItem);
        try {
          await setDoc(historyRef, { items: history.slice(0, 50) });
        } catch (e) {
          console.error('UserDataService: Failed to save history heartbeat:', e);
        }
      } else if (fallbackData) {
        // Add to history if not there
        console.log(`UserDataService: First heartbeat for ${itemId}. Creating history entry.`);
        const newItem: WatchHistoryItem = {
          ...fallbackData,
          progress: 1, // Tiny starting progress
          duration: 0,
          watchedAt: Date.now()
        };
        history.unshift(newItem);
        try {
          await setDoc(historyRef, { items: history.slice(0, 50) });
        } catch (e) {
          console.error('UserDataService: Failed to create history entry:', e);
        }
      }
      return;
    }

    if (itemIndex === -1 && fallbackData) {
      // If item not found but we have fallback data, add it now
      console.log(`UserDataService: Item ${itemId} not found in history. Adding initial entry.`);
      const newItem: WatchHistoryItem = {
        ...fallbackData,
        progress,
        duration: durationSeconds,
        watchedAt: Date.now()
      };
      history.unshift(newItem);
      itemIndex = 0;
      
      // Grant initial XP for starting (5 XP)
      await this.addXP(uid, 5, (progress / 100) * (durationSeconds / 60));
    }

    if (itemIndex !== -1) {
      const oldProgress = history[itemIndex].progress || 0;
      const progressDiff = progress - oldProgress;
      
      // Only grant XP if progress is increasing
      if (progressDiff > 0.5) { // Lowered threshold for better tracking
        const minutesEarned = (progressDiff / 100) * (durationSeconds / 60);
        const xpEarned = Math.round(minutesEarned * 10); // 10 XP per minute

        if (xpEarned > 0) {
          console.log(`UserDataService: Granting ${xpEarned} XP for ${minutesEarned.toFixed(2)} minutes watched`);
          await this.addXP(uid, xpEarned, minutesEarned);
        }
      }

      history[itemIndex].progress = progress;
      history[itemIndex].duration = durationSeconds;
      history[itemIndex].watchedAt = Date.now();
      
      // Boost back to the top
      const updatedItem = history.splice(itemIndex, 1)[0];
      history.unshift(updatedItem);
      
      try {
        await setDoc(historyRef, { items: history.slice(0, 50) });
      } catch (e) {
        console.error('UserDataService: Failed to save progress update:', e);
      }
    }
  }

  private async addXP(uid: string, xp: number, minutes: number) {
    const userRef = this.getUserDocRef(uid);
    
    // Ensure the doc exists first (especially for legacy users)
    await this.ensureUserProfile(uid, null, null);
    
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as UserProfile;
      // data.stats is guaranteed now by ensureUserProfile
      const newXP = (data.stats!.xp || 0) + xp;
      const newMinutes = (data.stats!.totalMinutesWatched || 0) + minutes;
      const rankInfo = this.calculateRank(newXP);
      
      await updateDoc(userRef, {
        'stats.xp': newXP,
        'stats.totalMinutesWatched': newMinutes,
        'stats.rank': rankInfo.name
      });
    }
  }

  async clearWatchHistory(uid: string): Promise<void> {
    const historyRef = this.getWatchHistoryRef(uid);
    await setDoc(historyRef, { items: [] });
  }

  // My List Management
  async addToMyList(uid: string, item: Omit<MyListItem, 'addedAt'>): Promise<void> {
    const myListRef = this.getMyListRef(uid);
    const myListItem: MyListItem = {
      ...item,
      addedAt: Date.now()
    };

    const docSnap = await getDoc(myListRef);
    let myList: MyListItem[] = [];
    
    if (docSnap.exists()) {
      myList = docSnap.data().items || [];
    }

    myList = myList.filter(item => item.id !== myListItem.id);
    myList.push(myListItem);

    await setDoc(myListRef, { items: myList });
    
    // Bonus XP for adding to list
    await this.addXP(uid, 50, 0);
  }

  async getMyList(uid: string, status?: string): Promise<MyListItem[]> {
    const myListRef = this.getMyListRef(uid);
    const docSnap = await getDoc(myListRef);
    
    if (docSnap.exists()) {
      let myList: MyListItem[] = docSnap.data().items || [];
      if (status) myList = myList.filter(item => item.status === status);
      return myList.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    }
    return [];
  }

  async removeFromMyList(uid: string, itemId: string): Promise<void> {
    const myListRef = this.getMyListRef(uid);
    const docSnap = await getDoc(myListRef);
    
    if (docSnap.exists()) {
      const myList: MyListItem[] = docSnap.data().items || [];
      const updatedList = myList.filter(item => item.id !== itemId);
      await setDoc(myListRef, { items: updatedList });
    }
  }

  async updateMyListItem(uid: string, itemId: string, updates: Partial<MyListItem>): Promise<void> {
    const myListRef = this.getMyListRef(uid);
    const docSnap = await getDoc(myListRef);
    
    if (docSnap.exists()) {
      const myList: MyListItem[] = docSnap.data().items || [];
      const idx = myList.findIndex(item => item.id === itemId);
      if (idx !== -1) {
        myList[idx] = { ...myList[idx], ...updates };
        await setDoc(myListRef, { items: myList });
      }
    }
  }

  async isInMyList(uid: string, itemId: string): Promise<boolean> {
    const myList = await this.getMyList(uid);
    return myList.some(item => item.id === itemId);
  }

  // Statistics
  async getUserStats(uid: string) {
    const [profile, watchHistory, myList] = await Promise.all([
      this.getUserProfile(uid),
      this.getWatchHistory(uid, 100),
      this.getMyList(uid)
    ]);

    const stats = profile?.stats || {
      xp: 0,
      rank: 'Newbie',
      level: 1,
      totalMinutesWatched: 0,
      episodesCompleted: 0
    };

    return {
      ...stats,
      totalInList: myList.length,
      watchingCount: myList.filter(item => item.status === 'watching').length,
      completedCount: myList.filter(item => item.status === 'completed').length,
      planToWatchCount: myList.filter(item => item.status === 'plan-to-watch').length
    };
  }
}

export const userDataService = new UserDataService();
