import Image from 'next/image'

type Props = {
  url: string
  title?: string | null
  number?: string | null
  poster?: string | null
  seriesUrl: string
  postId?: number
  season: number
  progress?: number // 0..1
  completed?: boolean
  isCurrentEpisode?: boolean
}

export default function EpisodeCard({ url, title, number, poster, seriesUrl, postId, season, progress = 0, completed = false, isCurrentEpisode = false }: Props) {
  const seriesTitle = decodeURIComponent(seriesUrl.split('/').filter(Boolean).pop() || '');
  
  // Extract episode identifier from the full episode URL
  let episodeId = '';
  try {
    const decoded = decodeURIComponent(url);
    if (/^https?:\/\//i.test(decoded) && decoded.includes('/episode/')) {
      episodeId = decoded.split('/episode/')[1]?.split('/')[0] || '';
    } else if (/^episode-/i.test(decoded)) {
      episodeId = decoded.replace(/^episode-/i, '');
    } else if (/-\d+x\d+$/i.test(decoded)) {
      episodeId = decoded;
    }
  } catch {}

  const watchHref = episodeId ? `/watch?episode=${episodeId}` : `/watch?episode=${encodeURIComponent(url)}`
  
  return (
    <a href={watchHref} className="group block focus:outline-none">
      <article className={`relative flex flex-col rounded-xl overflow-hidden border transition-all duration-300 ${
        isCurrentEpisode 
          ? 'border-accent/50 shadow-lg shadow-accent/10 bg-accent/5' 
          : 'border-border-subtle bg-bg-surface hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5'
      }`}>
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden bg-bg-elevated">
          {poster ? (
            <Image 
              unoptimized 
              src={poster.startsWith('data:') ? poster : `/api/image?src=${encodeURIComponent(poster)}`} 
              alt={title || 'Episode'} 
              fill 
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" 
              className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-80" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-bg-elevated">
              <span className="text-accent/40 font-serif text-4xl font-bold italic">{number || '?'}</span>
            </div>
          )}
          
          {/* Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/90 shadow-2xl shadow-accent/40 scale-75 group-hover:scale-100 transition-transform duration-500">
              <svg className="w-5 h-5 text-bg-base ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          
          {/* Episode Number Badge */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-bg-base/80 backdrop-blur-md rounded-md border border-white/10">
            <span className="text-white text-[10px] font-black uppercase tracking-widest">{number || '?'}</span>
          </div>

          {/* Now Playing Indicator */}
          {isCurrentEpisode && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-accent/90 rounded-md">
              <span className="text-bg-base text-[9px] font-black uppercase tracking-widest">Playing</span>
            </div>
          )}

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
              <div 
                className="h-full bg-accent transition-all duration-500 rounded-r-full" 
                style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }} 
              />
            </div>
          )}
        </div>
        
        {/* Episode Info */}
        <div className="px-2 py-2 space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className={`text-[11px] font-bold leading-snug line-clamp-1 transition-colors ${
              isCurrentEpisode ? 'text-accent' : 'text-content-primary group-hover:text-accent'
            }`}>
              {title || `Episode ${number || 'Unknown'}`}
            </h3>
            {completed && !isCurrentEpisode && (
              <div className="flex-shrink-0 w-4 h-4 bg-accent/20 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
            )}
          </div>
          <span className="text-[9px] text-content-tertiary font-bold uppercase tracking-widest">
            EP {number || '?'}
          </span>
        </div>
      </article>
    </a>
  )
}
