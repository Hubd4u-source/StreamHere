"use client";
import React, { useState, useEffect } from 'react';
import { animeCacheService, CachedAnime } from '@/lib/animeCacheService';
import Link from 'next/link';

export default function AdminContentPage() {
  const [animes, setAnimes] = useState<CachedAnime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadAnimes() {
      const all = await animeCacheService.getAllCached(100);
      setAnimes(all);
      setIsLoading(false);
    }
    loadAnimes();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      const all = await animeCacheService.getAllCached(100);
      setAnimes(all);
      return;
    }
    setIsLoading(true);
    const results = await animeCacheService.searchCached(searchTerm);
    setAnimes(results);
    setIsLoading(false);
  };

  const handleDelete = async (slug: string) => {
    if (confirm('Are you sure you want to delete this cache entry?')) {
      await animeCacheService.deleteCache(slug);
      setAnimes(prev => prev.filter(a => a.id !== slug));
    }
  };

  if (isLoading && animes.length === 0) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-content-tertiary animate-pulse font-bold tracking-widest uppercase text-xs">Loading content database...</div>
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Content Management</h1>
          <p className="text-content-tertiary">Manage cached anime data and metadata.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link 
            href="/admin/content/sync" 
            className="px-6 py-3 bg-accent/10 text-accent border border-accent/20 rounded-2xl font-bold text-sm hover:bg-accent/20 transition-all flex items-center gap-2 whitespace-nowrap"
          >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
             Bulk Sync
          </Link>
          <form onSubmit={handleSearch} className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search database..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 bg-bg-surface border border-border-subtle rounded-2xl focus:outline-none focus:border-accent transition-all pl-12"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-content-tertiary">🔍</span>
          </form>
        </div>
      </header>

      <div className="bg-bg-surface border border-border-subtle rounded-3xl overflow-hidden shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated/50 text-content-tertiary text-[10px] font-bold uppercase tracking-widest border-b border-border-subtle">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Episodes</th>
                <th className="px-6 py-4">Last Fetched</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {animes.map((anime) => (
                <tr key={anime.id} className="hover:bg-accent/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <img src={anime.image || ''} alt="" className="w-10 h-14 object-cover rounded-lg bg-bg-elevated shadow-md" />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-content-primary line-clamp-1">{anime.title}</p>
                        <p className="text-[10px] text-content-tertiary font-mono">{anime.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${anime.status === 'Ongoing' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {anime.status || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-content-secondary">
                    {anime.episodes?.length || 0}
                  </td>
                  <td className="px-6 py-4 text-xs text-content-tertiary">
                    {new Date(anime.lastFetched).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/admin/content/${anime.id}`}
                        className="p-2.5 hover:bg-accent/20 text-accent rounded-xl transition-all hover:scale-110 active:scale-95"
                        title="Edit Metadata"
                      >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                         </svg>
                      </Link>
                      <button 
                        onClick={() => handleDelete(anime.id)}
                        className="p-2.5 hover:bg-red-500/20 text-red-500 rounded-xl transition-all hover:scale-110 active:scale-95"
                        title="Delete Cache"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2m3 3h4M3 7h16" />
                         </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {animes.length === 0 && !isLoading && (
            <div className="p-24 text-center space-y-6">
               <div className="w-20 h-20 bg-bg-elevated rounded-full flex items-center justify-center mx-auto text-4xl opacity-50 grayscale">
                 📁
               </div>
               <div className="space-y-2">
                 <h3 className="text-xl font-bold text-content-primary">Database Empty</h3>
                 <p className="text-content-tertiary">No animes have been cached yet. Browse your site to populate the database.</p>
               </div>
               <Link href="/" className="inline-block px-8 py-3 bg-accent text-bg-base rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-accent/20 hover:scale-105 transition-all">Go to Home</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
