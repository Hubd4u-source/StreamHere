"use client";
import React, { useMemo } from "react";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/components/useProgress";
import NewAnimeCard from "./NewAnimeCard";

export default function ContinueWatchingHome() {
  const { user } = useAuth();
  const { watchHistory, isLoading } = useWatchHistory();
  const { ratio } = useProgress();

  // If user is logged in, use cloud history. If guest, use local progress.
  const entries = useMemo(() => {
    if (user) {
      // Filter for items with significant progress but not fully finished (>2% and <95%)
      return watchHistory
        .filter(item => (item.progress || 0) > 2 && (item.progress || 0) < 95)
        .slice(0, 12);
    } else {
      // Guest fallback (Local Storage)
      try {
        const raw = localStorage.getItem('amai:progress:v1');
        const map = raw ? JSON.parse(raw) as Record<string, { position: number; duration: number }> : {};
        return Object.entries(map)
          .filter(([, v]) => v && v.duration > 0 && (v.position || 0) > 0 && (v.position / v.duration) < 0.95 && (v.position / v.duration) > 0.02)
          .sort((a, b) => (b[1].position / b[1].duration) - (a[1].position / a[1].duration))
          .map(([url, v]) => ({
             id: url,
             url: url,
             title: decodeURIComponent(url.split('/').filter(Boolean).pop() || 'Episode').replace(/-/g, ' '),
             episode: url.match(/-(\d+)x(\d+)$/i)?.[2] || '?',
             progress: (v.position / v.duration) * 100,
             poster: undefined
          }))
          .slice(0, 12);
      } catch {
        return [];
      }
    }
  }, [user, watchHistory]);

  if (!entries.length && !isLoading) return null;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="section-heading text-3xl md:text-4xl text-content-primary">Continue Watching</h2>
            <p className="section-subtitle text-lg">Pick up exactly where you left off</p>
          </div>
        </div>

        {isLoading ? (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
             {[...Array(6)].map((_, i) => (
               <div key={i} className="aspect-video w-full bg-bg-surface border border-border-subtle rounded-2xl animate-pulse" />
             ))}
           </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {entries.map((item) => (
              <a 
                key={item.id} 
                href={item.url.includes('/watch') ? item.url : `/watch?episode=${encodeURIComponent(item.id)}`} 
                className="group relative block rounded-2xl overflow-hidden border border-border-subtle bg-bg-surface transition-all duration-500 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-1"
              >
                <div className="aspect-video w-full bg-bg-elevated relative overflow-hidden">
                  {item.poster ? (
                    <img 
                      src={item.poster.startsWith('data:') ? item.poster : `/api/image?src=${encodeURIComponent(item.poster)}`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-accent/20">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  )}
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 via-bg-base/20 to-transparent opacity-80" />

                  <div className="absolute bottom-3 left-4 right-4 z-20">
                    <div className="text-content-primary text-[13px] font-bold line-clamp-1 group-hover:text-accent transition-colors duration-300">
                      {item.title}
                    </div>
                    {item.episode && (
                      <div className="text-accent text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">
                        EP {item.episode}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3 bg-bg-surface/50 backdrop-blur-sm">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-content-tertiary">
                    <span>Progress</span>
                    <span className="text-accent">{Math.round(item.progress || 0)}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-base">
                    <div 
                      className="h-full bg-accent shadow-[0_0_12px_var(--accent)] transition-all duration-1000 ease-out" 
                      style={{ width: `${Math.min(100, Math.round(item.progress || 0))}%` }} 
                    />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
