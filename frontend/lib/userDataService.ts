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
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

export interface WatchHistoryItem {
  id: string;
  title: string;
  episode: string;
  season?: string;
  poster?: string;
  url: string;
  watchedAt: Date;
  progress?: number; // 0-100 percentage
  duration?: number; // total duration in seconds
}

export interface MyListItem {
  id: string;
  title: string;
  poster?: string;
  url: string;
  addedAt: Date;
  status: 'watching' | 'completed' | 'plan-to-watch' | 'dropped';
  rating?: number; // 1-10
  notes?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
  };
}

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

  // User Profile Management
  async createUserProfile(user: any): Promise<void> {
    const userProfile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || 'Anonymous User',
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: true
      }
    };

    await setDoc(this.getUserDocRef(user.uid), userProfile);
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
      lastLoginAt: serverTimestamp()
    });
  }

  // Watch History Management
  async addToWatchHistory(uid: string, item: Omit<WatchHistoryItem, 'watchedAt'>): Promise<void> {
    const historyRef = this.getWatchHistoryRef(uid);
    const historyItem: WatchHistoryItem = {
      ...item,
      watchedAt: new Date()
    };

    // Get current history
    const docSnap = await getDoc(historyRef);
    let history: WatchHistoryItem[] = [];
    
    if (docSnap.exists()) {
      history = docSnap.data().items || [];
    }

    // Remove existing entry for same episode if exists
    history = history.filter(h => h.id !== item.id);

    // Add new entry at the beginning
    history.unshift(historyItem);

    // Keep only last 100 entries
    if (history.length > 100) {
      history = history.slice(0, 100);
    }

    await setDoc(historyRef, { items: history });
  }

  async getWatchHistory(uid: string, limitCount: number = 50): Promise<WatchHistoryItem[]> {
    const historyRef = this.getWatchHistoryRef(uid);
    const docSnap = await getDoc(historyRef);
    
    if (docSnap.exists()) {
      const history = docSnap.data().items || [];
      return history.slice(0, limitCount);
    }
    return [];
  }

  async updateWatchProgress(uid: string, itemId: string, progress: number): Promise<void> {
    const historyRef = this.getWatchHistoryRef(uid);
    const docSnap = await getDoc(historyRef);
    
    if (docSnap.exists()) {
      const history: WatchHistoryItem[] = docSnap.data().items || [];
      const updatedHistory = history.map(item => 
        item.id === itemId ? { ...item, progress } : item
      );
      
      await setDoc(historyRef, { items: updatedHistory });
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
      addedAt: new Date()
    };

    // Get current list
    const docSnap = await getDoc(myListRef);
    let myList: MyListItem[] = [];
    
    if (docSnap.exists()) {
      myList = docSnap.data().items || [];
    }

    // Remove existing entry if exists
    myList = myList.filter(item => item.id !== myListItem.id);

    // Add new entry
    myList.push(myListItem);

    await setDoc(myListRef, { items: myList });
  }

  async getMyList(uid: string, status?: string): Promise<MyListItem[]> {
    const myListRef = this.getMyListRef(uid);
    const docSnap = await getDoc(myListRef);
    
    if (docSnap.exists()) {
      let myList: MyListItem[] = docSnap.data().items || [];
      
      if (status) {
        myList = myList.filter(item => item.status === status);
      }
      
      return myList.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
    }
    return [];
  }

  async updateMyListItem(uid: string, itemId: string, updates: Partial<MyListItem>): Promise<void> {
    const myListRef = this.getMyListRef(uid);
    const docSnap = await getDoc(myListRef);
    
    if (docSnap.exists()) {
      const myList: MyListItem[] = docSnap.data().items || [];
      const updatedList = myList.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      );
      
      await setDoc(myListRef, { items: updatedList });
    }
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

  async isInMyList(uid: string, itemId: string): Promise<boolean> {
    const myList = await this.getMyList(uid);
    return myList.some(item => item.id === itemId);
  }

  // Statistics
  async getUserStats(uid: string): Promise<{
    totalWatched: number;
    totalInList: number;
    watchingCount: number;
    completedCount: number;
    planToWatchCount: number;
  }> {
    const [watchHistory, myList] = await Promise.all([
      this.getWatchHistory(uid),
      this.getMyList(uid)
    ]);

    return {
      totalWatched: watchHistory.length,
      totalInList: myList.length,
      watchingCount: myList.filter(item => item.status === 'watching').length,
      completedCount: myList.filter(item => item.status === 'completed').length,
      planToWatchCount: myList.filter(item => item.status === 'plan-to-watch').length
    };
  }
}

export const userDataService = new UserDataService();
