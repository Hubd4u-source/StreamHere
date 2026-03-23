"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProgress } from "@/components/useProgress";
import { useWatchHistory } from "@/hooks/useWatchHistory";

type PlayerSourceItem = { src: string; kind: "iframe" | "video"; label?: string | null; quality?: string | null };

interface PlayerProps {
  sources: PlayerSourceItem[];
  episodeData?: {
    id: string;
    title: string;
    episode: string;
    season?: string;
    poster?: string;
    url: string;
  };
}

export default function Player({ sources, episodeData }: PlayerProps) {
  const safeSources = useMemo(() => {
    const seen = new Set<string>();
    return (sources || []).filter((s) => (s?.src && !seen.has(s.src) ? (seen.add(s.src), true) : false));
  }, [sources]);

  const [idx, setIdx] = useState(0);
  const current = safeSources[idx] || null;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { set: setProgress, get: getProgress } = useProgress();
  const { addToWatchHistory, updateWatchProgress } = useWatchHistory();
  const [hasAddedToHistory, setHasAddedToHistory] = useState(false);

  // Add to watch history when user starts watching
  useEffect(() => {
    if (!episodeData || hasAddedToHistory) return;
    
    console.log('Player: Adding to watch history:', episodeData);
    
    // Add to history after a short delay to ensure the player is loaded
    const timer = setTimeout(() => {
      if (episodeData) {
        console.log('Player: Calling addToWatchHistory with:', {
          id: episodeData.id,
          title: episodeData.title,
          episode: episodeData.episode,
          season: episodeData.season,
          poster: episodeData.poster,
          url: episodeData.url
        });
        
        addToWatchHistory({
          id: episodeData.id,
          title: episodeData.title,
          episode: episodeData.episode,
          season: episodeData.season,
          poster: episodeData.poster,
          url: episodeData.url
        });
        setHasAddedToHistory(true);
      }
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  // Heartbeat for IFrames (since we can't track progress via events)
  useEffect(() => {
    if (!current || current.kind !== "iframe" || !episodeData) return;

    console.log('Player: Starting iframe heartbeat for:', episodeData.title);
    
    const interval = setInterval(() => {
      // Only sync if the tab is visible to prevent AFK XP farming
      if (document.visibilityState === 'visible') {
        console.log('Player: Iframe heartbeat - Updating watch time');
        updateWatchProgress(episodeData.id, 0, 0, {
          id: episodeData.id,
          title: episodeData.title,
          episode: episodeData.episode,
          season: episodeData.season,
          poster: episodeData.poster,
          url: episodeData.url
        }, true); // Pass isHeartbeat=true
      }
    }, 60000); // Every 1 minute

    return () => clearInterval(interval);
  }, [current?.src, current?.kind, episodeData, updateWatchProgress]);

  // Resume time for HTML5 video
  useEffect(() => {
    if (!current || current.kind !== "video") return;
    const v = videoRef.current;
    if (!v) return;
    try {
      const p = getProgress(current.src);
      if (p && p.position > 0 && p.duration > 0 && p.position < p.duration - 2) {
        v.currentTime = p.position;
      }
    } catch {}

    const onTime = () => {
      try {
        if (!v.duration || isNaN(v.duration)) return;
        const progress = (v.currentTime / v.duration) * 100;
        
        // Update LocalStorage (for guests/redundancy)
        setProgress(current.src, v.currentTime || 0, v.duration || 0);

        // Update Firestore (for logged in users - every ~5% increment to save writes)
        if (episodeData) {
          const lastSynced = v.getAttribute('data-last-sync') || '0';
          if (Math.abs(progress - parseFloat(lastSynced)) > 5 || v.ended) {
            console.log(`Player: Syncing progress ${progress.toFixed(2)}% to Firestore`);
            updateWatchProgress(episodeData.id, progress, v.duration, {
              id: episodeData.id,
              title: episodeData.title,
              episode: episodeData.episode,
              season: episodeData.season,
              poster: episodeData.poster,
              url: episodeData.url
            });
            v.setAttribute('data-last-sync', progress.toString());
          }
        }
      } catch {}
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onTime);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onTime);
    };
  }, [current?.src, current?.kind]);

  return (
    <div className="space-y-6">
      <div className="bg-bg-surface rounded-md overflow-hidden border border-border-subtle shadow-2xl">
        <div className="aspect-video w-full bg-black">
          {current ? (
            current.kind === "iframe" ? (
              <iframe
                key={current.src}
                src={current.src}
                className="w-full h-full"
                frameBorder={0}
                allowFullScreen
                allow="autoplay; encrypted-media"
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            ) : (
              <video
                key={current.src}
                ref={videoRef as any}
                controls
                className="w-full h-full text-accent"
                autoPlay
              >
                <source src={current.src} />
                Your browser does not support the video tag.
              </video>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-content-tertiary">
              <span className="text-sm">No player sources available</span>
            </div>
          )}
        </div>
      </div>

      {safeSources.length > 1 && (
        <div className="flex items-center justify-between bg-bg-surface rounded-md px-5 py-3 border border-border-subtle">
          <div className="text-[13px] font-medium text-content-secondary uppercase tracking-wider">Select Server</div>
          <div className="relative">
            <select
              value={idx}
              onChange={(e) => setIdx(Number(e.target.value))}
              className="bg-bg-elevated text-content-primary text-sm px-4 py-2 rounded-md border border-border-subtle focus:outline-none focus:border-accent-muted transition-colors appearance-none pr-10 cursor-pointer"
            >
              {safeSources.map((s, i) => (
                <option key={s.src} value={i}>
                  {s.label || s.quality || `Server ${i + 1}`}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-content-tertiary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


