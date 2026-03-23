"use client";
import { useRef, useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type CarouselProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showViewAll?: boolean;
  viewAllHref?: string;
  autoplay?: boolean;
  autoplayIntervalMs?: number;
  loop?: boolean;
};

export default function NewCarousel({
  title,
  subtitle,
  children,
  showViewAll = false,
  viewAllHref,
  autoplay = false,
  autoplayIntervalMs = 2500,
  loop = false,
}: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollStep, setScrollStep] = useState<number>(380);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      try {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      } catch (error) {
        console.error('Error checking scroll position:', error);
      }
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      try {
        const scrollAmount = scrollStep || 400;
        const newScrollLeft =
          scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
        
        scrollContainerRef.current.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        });
      } catch (error) {
        console.error('Error scrolling:', error);
      }
    }
  };

  const handleScroll = () => {
    checkScrollPosition();
  };

  // Measure child width to scroll by one card
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const measure = () => {
      try {
        const first = el.firstElementChild as HTMLElement | null;
        if (first) {
          // Include the gap ~16px (gap-4)
          const gapPx = 16;
          const w = first.getBoundingClientRect().width + gapPx;
          if (w > 0) setScrollStep(w);
        }
      } catch {}
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [children]);

  // Check scroll position on mount and when children change
  useEffect(() => {
    checkScrollPosition();
  }, [children]);

  // Continuous autoplay (smooth sliding). Pauses on hover.
  useEffect(() => {
    if (!autoplay) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    let rafId = 0;
    const speedPxPerFrame = 0.8; // smooth slow slide

    const tick = () => {
      try {
        if (!isHovered) {
          const { scrollLeft, scrollWidth, clientWidth } = el;
          const nearEnd = scrollLeft >= scrollWidth - clientWidth - 1;
          if (nearEnd) {
            if (loop) {
              el.scrollTo({ left: 0 });
            }
          } else {
            el.scrollLeft = scrollLeft + speedPxPerFrame;
          }
        }
      } catch {}
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [autoplay, loop, isHovered]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between px-1">
        <div>
          <h2 className="section-heading">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {showViewAll && viewAllHref && (
          <a
            href={viewAllHref}
            className="text-accent hover:text-accent-hover text-sm font-medium transition-colors mb-1"
          >
            View All →
          </a>
        )}
      </div>

      {/* Carousel Container */}
      <div 
        className="relative group/carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {children}
        </div>

        {/* Navigation Arrows - Desktop Only */}
        <div className={`hidden md:block absolute left-[-16px] top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-8 h-8 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-content-secondary transition-all duration-200 ${
              canScrollLeft
                ? "hover:bg-bg-overlay hover:text-content-primary cursor-pointer"
                : "opacity-30 cursor-not-allowed"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
        </div>

        <div className={`hidden md:block absolute right-[-16px] top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-8 h-8 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-content-secondary transition-all duration-200 ${
              canScrollRight
                ? "hover:bg-bg-overlay hover:text-content-primary cursor-pointer"
                : "opacity-30 cursor-not-allowed"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
