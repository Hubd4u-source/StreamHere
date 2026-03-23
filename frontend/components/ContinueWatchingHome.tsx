"use client";
import { useMemo } from "react";
import { useProgress } from "@/components/useProgress";

function extractEpisodeId(url: string): string {
  try {
    const decoded = decodeURIComponent(url);
    if (/^https?:\/\//i.test(decoded) && decoded.includes('/episode/')) {
      return decoded.split('/episode/')[1]?.split('/')[0] || decoded;
    }
    return decoded;
  } catch {
    return url;
  }
}

export default function ContinueWatchingHome() {
  const { ratio } = useProgress();

  // Read raw map from localStorage via hook internals
  const entries = useMemo(() => {
    try {
      const raw = localStorage.getItem('amai:progress:v1');
      const map = raw ? JSON.parse(raw) as Record<string, { position: number; duration: number; completed?: boolean }> : {};
      return Object.entries(map)
        .filter(([, v]) => v && v.duration > 0 && (v.position || 0) > 0 && (v.position / v.duration) < 0.98)
        .sort((a, b) => (b[1].position / b[1].duration) - (a[1].position / a[1].duration))
        .slice(0, 12);
    } catch {
      return [] as Array<[string, { position: number; duration: number }]>;
    }
  }, []);

  if (!entries.length) return null;

  return (
    <section>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="section-heading text-2xl md:text-3xl">Continue Watching</h2>
            <p className="section-subtitle">Pick up exactly where you left off</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {entries.map(([epUrl]) => {
            const epId = extractEpisodeId(epUrl);
            const p = ratio(epUrl);
            const title = decodeURIComponent(epId.split('/').filter(Boolean).pop() || 'Episode');
            return (
              <a 
                key={epUrl} 
                href={`/watch?episode=${encodeURIComponent(epId)}`} 
                className="group relative block rounded-2xl overflow-hidden border border-border-subtle bg-bg-surface transition-all duration-500 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-1"
              >
                <div className="aspect-video w-full bg-bg-elevated relative overflow-hidden">
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 to-transparent z-10" />
                  
                  {/* Play Icon Placeholder / Abstract Background */}
                  <div className="absolute inset-0 flex items-center justify-center text-accent/20">
                     <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>

                  <div className="absolute bottom-2 left-3 right-3 z-20">
                    <div className="text-content-primary text-xs font-bold line-clamp-1 group-hover:text-accent transition-colors duration-300">
                      {title.replace(/-/g, ' ')}
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-content-tertiary">
                    <span>Progress</span>
                    <span className="text-accent">{Math.round(p * 100)}%</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-border-subtle">
                    <div 
                      className="h-full bg-accent shadow-[0_0_8px_var(--accent)] transition-all duration-700 ease-out" 
                      style={{ width: `${Math.min(100, Math.round(p * 100))}%` }} 
                    />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}


