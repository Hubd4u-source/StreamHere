import { doc, getDoc, setDoc, updateDoc, collection, query, limit, getDocs, orderBy, where, Timestamp, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { AnimeDetailsResponse, SeriesListItem } from '@/server/types';

export interface CachedAnime {
  id: string; // The slug
  title: string;
  url: string;
  image?: string | null;
  synopsis?: string | null;
  status?: string | null;
  type?: string | null;
  lastFetched: number;
  seasons?: any[];
  episodes?: any[];
  isFeatured?: boolean;
  isPopular?: boolean;
  rating?: number | null;
  year?: number | null;
  postId?: number | null;
  poster?: string | null;
  players?: any[];
}

const CACHE_COLLECTION = 'animes';
const STALE_THRESHOLD = 12 * 60 * 60 * 1000; // 12 hours

class AnimeCacheService {
  private getDocRef(slug: string) {
    // Sanitize slug to be used as ID
    const safeId = slug.replace(/[^a-zA-Z0-9_-]/g, '_');
    return doc(db, CACHE_COLLECTION, safeId);
  }

  async getCachedAnime(slug: string): Promise<CachedAnime | null> {
    try {
      if (!db || typeof db.type === 'undefined' && Object.keys(db).length === 0) return null;
      const docSnap = await getDoc(this.getDocRef(slug));
      if (docSnap.exists()) {
        return docSnap.data() as CachedAnime;
      }
      return null;
    } catch (e) {
      console.error('AnimeCacheService: Error getting cached anime', e);
      return null;
    }
  }

  async saveAnime(slug: string, data: Partial<CachedAnime>): Promise<void> {
    try {
      const docRef = this.getDocRef(slug);
      const docSnap = await getDoc(docRef);
      const now = Date.now();
      
      if (!docSnap.exists()) {
        await setDoc(docRef, { 
          ...data, 
          id: slug,
          lastFetched: now,
          createdAt: now
        });
      } else {
        await updateDoc(docRef, { 
          ...data, 
          lastFetched: now,
          updatedAt: now
        });
      }
    } catch (e) {
      console.error('AnimeCacheService: Error saving anime', e);
    }
  }

  isStale(anime: CachedAnime): boolean {
    return Date.now() - anime.lastFetched > STALE_THRESHOLD;
  }

  async getAllCached(limitCount: number = 50): Promise<CachedAnime[]> {
    try {
      const q = query(collection(db, CACHE_COLLECTION), orderBy('lastFetched', 'desc'), limit(limitCount));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => d.data() as CachedAnime);
    } catch (e) {
      console.error('AnimeCacheService: Error getting all cached', e);
      return [];
    }
  }

  async searchCached(searchTerm: string): Promise<CachedAnime[]> {
    try {
      // Basic search on title (case-sensitive unfortunately in Firestore without full-text)
      const q = query(
        collection(db, CACHE_COLLECTION), 
        where('title', '>=', searchTerm),
        where('title', '<=', searchTerm + '\uf8ff'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => d.data() as CachedAnime);
    } catch (e) {
      console.error('AnimeCacheService: Error searching cached', e);
      return [];
    }
  }

  async clearAllCache(): Promise<void> {
    try {
      const q = query(collection(db, CACHE_COLLECTION));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log('AnimeCacheService: Database cleared successfully');
    } catch (e) {
      console.error('AnimeCacheService: Error clearing database', e);
      throw e;
    }
  }
}

export const animeCacheService = new AnimeCacheService();
