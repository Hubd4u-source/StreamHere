"use client";
import { useEffect, useState } from "react";
import AnimeLink from "@/components/AnimeLink";

interface UpcomingEpisode {
  id: string;
  title: string;
  image: string;
  episode: string;
  countdown: number;
  url: string;
}

export default function UpcomingEpisodesGrid() {
  const [episodes, setEpisodes] = useState<UpcomingEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUpcomingEpisodes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/upcoming');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEpisodes(data.episodes || []);
        setError(null);
      } catch (err) {
        console.error('Error loading upcoming episodes:', err);
        setError(err instanceof Error ? err.message : 'Failed to load upcoming episodes');
      } finally {
        setLoading(false);
      }
    };

    loadUpcomingEpisodes();
  }, []);

  useEffect(() => {
    function updateCountdowns() {
      setEpisodes(prevEpisodes => 
        prevEpisodes.map(episode => ({
          ...episode,
          countdown: episode.countdown
        }))
      );
    }

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = timestamp - now;
    const absDiff = Math.abs(diff);
    const isPast = diff <= 0;
    const days = Math.floor(absDiff / (24 * 60 * 60));
    const hours = Math.floor((absDiff % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((absDiff % (60 * 60)) / 60);
    let timeText = '';
    if (days > 0) {
      timeText = `${days}d ${hours}h`;
    } else if (hours > 0) {
      timeText = `${hours}h ${minutes}m`;
    } else {
      timeText = `${minutes}m`;
    }
    return { timeText, isPast };
  };

  if (loading) {
    return (
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-6 min-w-max">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-48 animate-pulse space-y-4">
              <div className="aspect-[2/3] bg-bg-surface border border-border-subtle rounded-2xl"></div>
              <div className="h-3 w-3/4 bg-bg-surface rounded-full mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-bg-surface border border-red-500/20 rounded-3xl p-8 max-w-md mx-auto">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="section-heading text-lg mb-2">Error Loading Upcoming</h3>
          <p className="text-content-tertiary text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="text-center py-12 opacity-50">
        <p className="text-content-tertiary">No upcoming episodes available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="overflow-x-auto pb-8 scrollbar-hide">
        <div className="flex gap-6 min-w-max">
          {episodes.map((episode) => {
            const { timeText, isPast } = formatCountdown(episode.countdown);
            const imageSrc = episode.image.startsWith('data:') ? episode.image : `/api/image?src=${encodeURIComponent(episode.image.startsWith('//') ? `https:${episode.image}` : episode.image)}`;
            return (
              <div key={episode.id} className="w-48 group">
                <AnimeLink seriesUrl={episode.url} className="block space-y-4">
                  <div className="relative aspect-[2/3] bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-accent/40 group-hover:shadow-2xl group-hover:shadow-accent/5">
                    <img
                      src={imageSrc}
                      alt={episode.title}
                      className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1] transition-all duration-700 group-hover:grayscale-0"
                    />
                    
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                    {/* Badge: Episode */}
                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-bg-surface/90 border border-border-subtle rounded-md backdrop-blur-sm">
                      <span className="text-[10px] font-bold tracking-tight text-accent">{episode.episode}</span>
                    </div>

                    {/* Badge: Timer */}
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border backdrop-blur-md shadow-lg transition-all duration-500 ${
                      isPast 
                        ? 'bg-red-500/20 border-red-500/50 text-red-200' 
                        : 'bg-accent/10 border-accent/30 text-accent group-hover:bg-accent group-hover:text-bg-base'
                    }`}>
                      {timeText}
                    </div>

                    {/* Play Icon (Hover Only) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-bg-base shadow-2xl">
                        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="text-center px-2">
                    <h3 className="text-sm font-bold text-content-primary line-clamp-1 group-hover:text-accent transition-colors duration-300">
                      {episode.title}
                    </h3>
                    <p className="text-[10px] text-content-tertiary mt-1 font-medium uppercase tracking-[0.1em]">Coming Soon</p>
                  </div>
                </AnimeLink>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="text-center">
        <a
          href="/upcoming"
          className="btn-outline px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-accent/40 transition-all inline-flex items-center gap-2"
        >
          <span>View Schedule</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </a>
      </div>
    </div>
  );
}
