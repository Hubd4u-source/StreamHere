"use client";
import React, { useState, useEffect } from 'react';
import { animeCacheService, CachedAnime } from '@/lib/animeCacheService';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditContentPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  
  const [anime, setAnime] = useState<CachedAnime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function loadAnime() {
      if (!slug) return;
      const data = await animeCacheService.getCachedAnime(slug);
      if (data) {
        setAnime(data);
      }
      setIsLoading(false);
    }
    loadAnime();
  }, [slug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anime || !slug) return;
    setIsSaving(true);
    setMessage(null);
    try {
      await animeCacheService.saveAnime(slug, anime);
      setMessage({ text: 'Metadata updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to update metadata.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-content-tertiary animate-pulse font-bold tracking-widest uppercase text-xs p-10">Loading metadata...</div>;
  if (!anime) return <div className="text-red-500 font-bold p-10 text-center">Anime not found in database.</div>;

  return (
    <div className="max-w-5xl space-y-10 pb-20">
      <header className="flex items-center gap-6">
         <Link href="/admin/content" className="w-12 h-12 bg-bg-surface border border-border-subtle rounded-2xl flex items-center justify-center hover:bg-accent/10 transition-all hover:scale-105 shadow-lg group">
            <svg className="w-5 h-5 text-content-tertiary group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
         </Link>
         <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">Edit Metadata</h1>
            <p className="text-content-tertiary font-mono text-xs">{slug}</p>
         </div>
      </header>

      {message && (
        <div className={`p-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-500 ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
          <div className="flex items-center gap-3">
             <span className="text-lg">{message.type === 'success' ? '✨' : '⚠️'}</span>
             {message.text}
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-bg-surface border border-border-subtle rounded-[2.5rem] p-6 space-y-6 overflow-hidden shadow-2xl shadow-black/40">
              <div className="aspect-[2/3] relative rounded-3xl overflow-hidden bg-bg-elevated border border-border-subtle group">
                 <img src={anime.image} alt={anime.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <p className="text-xs text-white font-black uppercase tracking-widest">Preview Mode</p>
                    <p className="text-[10px] text-white/60">Uploads coming in future updates</p>
                 </div>
              </div>
              <div className="space-y-5">
                 <label className="block">
                    <span className="text-[10px] font-black text-content-tertiary uppercase tracking-[0.2em] block mb-3">Poster URL</span>
                    <input 
                       type="text" 
                       value={anime.image} 
                       onChange={e => setAnime({...anime, image: e.target.value})}
                       className="w-full px-5 py-4 bg-bg-elevated border border-border-subtle rounded-2xl text-xs focus:outline-none focus:border-accent transition-all font-medium"
                    />
                 </label>
                 <label className="block">
                    <span className="text-[10px] font-black text-content-tertiary uppercase tracking-[0.2em] block mb-3">Internal Post ID</span>
                    <input 
                       type="number" 
                       value={anime.postId || 0} 
                       readOnly
                       disabled
                       className="w-full px-5 py-4 bg-bg-elevated/30 border border-border-subtle rounded-2xl text-xs font-mono opacity-50 cursor-not-allowed"
                    />
                 </label>
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
           <div className="bg-bg-surface border border-border-subtle rounded-[2.5rem] p-10 space-y-10 shadow-2xl shadow-black/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <label className="col-span-2">
                    <span className="text-sm font-black text-content-primary uppercase tracking-widest block mb-4">Anime Title</span>
                    <input 
                       type="text" 
                       value={anime.title} 
                       onChange={e => setAnime({...anime, title: e.target.value})}
                       className="w-full px-6 py-5 bg-bg-elevated border border-border-subtle rounded-2xl text-lg font-bold text-content-primary focus:outline-none focus:border-accent transition-all shadow-inner"
                    />
                 </label>
                 <label>
                    <span className="text-sm font-black text-content-primary uppercase tracking-widest block mb-4">Current Status</span>
                    <div className="relative">
                       <select 
                          value={anime.status || ''} 
                          onChange={e => setAnime({...anime, status: e.target.value})}
                          className="w-full px-6 py-5 bg-bg-elevated border border-border-subtle rounded-2xl text-content-primary font-bold focus:outline-none focus:border-accent appearance-none transition-all shadow-inner"
                       >
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                          <option value="Airing">Airing</option>
                          <option value="Finished">Finished</option>
                       </select>
                       <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-content-tertiary">
                          ▼
                       </div>
                    </div>
                 </label>
                 <label>
                    <span className="text-sm font-black text-content-primary uppercase tracking-widest block mb-4">Release Year</span>
                    <input 
                       type="number" 
                       value={anime.year || 0} 
                       onChange={e => setAnime({...anime, year: Number(e.target.value)})}
                       className="w-full px-6 py-5 bg-bg-elevated border border-border-subtle rounded-2xl text-content-primary font-bold focus:outline-none focus:border-accent transition-all shadow-inner"
                    />
                 </label>
              </div>

              <label className="block">
                 <span className="text-sm font-black text-content-primary uppercase tracking-widest block mb-4">Synopsis / Plot Summary</span>
                 <textarea 
                    value={anime.synopsis || ''} 
                    onChange={e => setAnime({...anime, synopsis: e.target.value})}
                    rows={10}
                    className="w-full px-7 py-6 bg-bg-elevated border border-border-subtle rounded-[2rem] text-content-primary focus:outline-none focus:border-accent resize-none leading-relaxed text-sm font-medium shadow-inner"
                 />
              </label>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-10 p-6 bg-bg-elevated/40 rounded-[2rem] border border-border-subtle/50">
                 <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setAnime({...anime, isFeatured: !anime.isFeatured})}>
                    <div 
                      className={`w-14 h-7 rounded-full transition-all relative ${anime.isFeatured ? 'bg-accent shadow-lg shadow-accent/40 scale-110' : 'bg-bg-elevated border-2 border-border-subtle'}`}
                    >
                       <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-md ${anime.isFeatured ? 'left-8' : 'left-1'}`} />
                    </div>
                    <div>
                       <span className="text-sm font-black uppercase tracking-wider block">Featured</span>
                       <span className="text-[10px] text-content-tertiary font-bold">Hero Banner Carousel</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setAnime({...anime, isPopular: !anime.isPopular})}>
                    <div 
                      className={`w-14 h-7 rounded-full transition-all relative ${anime.isPopular ? 'bg-orange-500 shadow-lg shadow-orange-500/40 scale-110' : 'bg-bg-elevated border-2 border-border-subtle'}`}
                    >
                       <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-md ${anime.isPopular ? 'left-8' : 'left-1'}`} />
                    </div>
                    <div>
                       <span className="text-sm font-black uppercase tracking-wider block">Popular</span>
                       <span className="text-[10px] text-content-tertiary font-bold">Trending & Favorites</span>
                    </div>
                 </div>
              </div>

              <div className="pt-10 border-t border-border-subtle flex gap-6">
                 <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 h-20 bg-accent text-bg-base font-black uppercase tracking-[0.3em] text-sm rounded-[2rem] hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50 shadow-2xl shadow-accent/40 group overflow-hidden relative"
                 >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                       {isSaving ? (
                          <div className="w-5 h-5 border-4 border-bg-base/20 border-t-bg-base rounded-full animate-spin" />
                       ) : (
                          <span>Save Meta Override</span>
                       )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                 </button>
                 <button 
                    type="button"
                    onClick={() => window.open(`/watch?slug=${slug}`, '_blank')}
                    className="px-8 h-20 bg-bg-elevated border border-border-subtle rounded-[2.2rem] hover:bg-accent/10 transition-all hover:scale-105 active:scale-95 group shadow-xl"
                 >
                    <svg className="w-6 h-6 text-content-tertiary group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                 </button>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}
