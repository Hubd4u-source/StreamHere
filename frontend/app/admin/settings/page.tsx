"use client";
import React, { useState, useEffect } from 'react';
import { settingsService, SiteSettings } from '@/lib/settingsService';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const s = await settingsService.getSettings();
      setSettings(s);
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    setMessage(null);
    try {
      await settingsService.updateSettings(settings);
      setMessage({ text: 'Settings updated successfully! Changes may take a moment to reflect.', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to update settings. Check console for details.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-content-tertiary animate-pulse">Loading settings...</div>;

  return (
    <div className="max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">System Settings</h1>
        <p className="text-content-tertiary">Configure global site parameters and feature visibility.</p>
      </header>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 bg-bg-surface border border-border-subtle rounded-3xl p-8">
        {/* Site Base Configuration */}
        <div className="space-y-4">
          <label className="block">
            <span className="text-content-primary font-bold text-sm block mb-2">Original SITE_BASE</span>
            <input
              type="text"
              value={settings?.site_base || ''}
              onChange={e => setSettings(prev => prev ? { ...prev, site_base: e.target.value } : null)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle rounded-xl text-content-primary focus:outline-none focus:border-accent"
            />
            <p className="text-[10px] text-content-tertiary mt-2">The primary WordPress API source for the scraper.</p>
          </label>
        </div>

        {/* TMDB API Key */}
        <div className="space-y-4">
          <label className="block">
            <span className="text-content-primary font-bold text-sm block mb-2">TMDB API Key</span>
            <input
              type="text"
              value={settings?.tmdb_api_key || ''}
              onChange={e => setSettings(prev => prev ? { ...prev, tmdb_api_key: e.target.value } : null)}
              className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle rounded-xl text-content-primary focus:outline-none focus:border-accent"
            />
          </label>
        </div>

        <div className="h-px bg-border-subtle" />

        {/* Feature Toggles */}
        <div className="space-y-6">
           <h3 className="text-content-primary font-bold">Feature Visibility</h3>
           
           <div className="flex items-center justify-between group">
              <div>
                <p className="font-bold text-sm">Hide Schedule</p>
                <p className="text-xs text-content-tertiary">Disable the anime schedule section across the site.</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings(prev => prev ? { ...prev, hide_schedule: !prev.hide_schedule } : null)}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings?.hide_schedule ? 'bg-accent' : 'bg-bg-elevated border border-border-subtle'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings?.hide_schedule ? 'left-7' : 'left-1'}`} />
              </button>
           </div>

           <div className="flex items-center justify-between group">
              <div>
                <p className="font-bold text-sm">Hide Upcoming</p>
                <p className="text-xs text-content-tertiary">Disable the upcoming episodes section and route.</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings(prev => prev ? { ...prev, hide_upcoming: !prev.hide_upcoming } : null)}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings?.hide_upcoming ? 'bg-accent' : 'bg-bg-elevated border border-border-subtle'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings?.hide_upcoming ? 'left-7' : 'left-1'}`} />
              </button>
           </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full h-14 bg-accent text-bg-base font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-all disabled:opacity-50"
        >
          {isSaving ? 'Saving Changes...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
}
