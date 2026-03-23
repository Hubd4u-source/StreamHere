import Image from "next/image";

export function CardSkeleton() {
  return (
    <div className="space-y-2">
      <div className="skeleton aspect-[2/3] w-full" />
      <div className="skeleton h-3 w-3/4" />
    </div>
  );
}

export function ScreenSkeleton() {
  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden flex items-center justify-center font-sans">
      {/* Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] animate-pulse" />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-8">
          {/* Logo container with subtle border */}
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl opacity-40 animate-pulse" />
            <div className="relative w-28 h-28 bg-bg-surface border border-border-subtle rounded-3xl flex items-center justify-center shadow-2xl">
              <Image
                unoptimized
                src="https://i.ibb.co/YBQ2N8w7/logo.png"
                alt="AMAI TV"
                width={80}
                height={80}
                className="object-contain opacity-90 transition-opacity duration-1000 animate-pulse"
              />
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-content-primary">
              AMAI TV
            </h1>
            <p className="text-accent text-xs font-bold uppercase tracking-[0.3em] font-sans">
              Preparing your experience
            </p>
          </div>
        </div>

        {/* Minimal Loading Indicator */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-48 h-[2px] bg-border-subtle rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent rounded-full animate-loading-bar" 
              style={{
                width: '30%',
                boxShadow: '0 0 15px var(--accent)'
              }}
            />
          </div>
          
          {/* Bouncing Dots */}
          <div className="flex space-x-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


