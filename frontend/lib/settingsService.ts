import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface SiteSettings {
  site_base: string;
  tmdb_api_key: string;
  hide_schedule: boolean;
  hide_upcoming: boolean;
  lastUpdated?: number;
}

const DEFAULT_SETTINGS: SiteSettings = {
  site_base: process.env.SITE_BASE || '',
  tmdb_api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY || '',
  hide_schedule: true,
  hide_upcoming: true,
};

class SettingsService {
  private getSettingsDocRef() {
    return doc(db, 'system', 'settings');
  }

  async getSettings(): Promise<SiteSettings> {
    try {
      if (!db || typeof db.type === 'undefined' && Object.keys(db).length === 0) {
         return DEFAULT_SETTINGS;
      }
      const docSnap = await getDoc(this.getSettingsDocRef());
      if (docSnap.exists()) {
        return { ...DEFAULT_SETTINGS, ...docSnap.data() } as SiteSettings;
      }
      return DEFAULT_SETTINGS;
    } catch (e) {
      console.error('SettingsService: Error fetching settings', e);
      return DEFAULT_SETTINGS;
    }
  }

  async updateSettings(updates: Partial<SiteSettings>): Promise<void> {
    try {
      const docRef = this.getSettingsDocRef();
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, { ...DEFAULT_SETTINGS, ...updates, lastUpdated: Date.now() });
      } else {
        await updateDoc(docRef, { ...updates, lastUpdated: Date.now() });
      }
    } catch (e) {
      console.error('SettingsService: Error updating settings', e);
      throw e;
    }
  }
}

export const settingsService = new SettingsService();
