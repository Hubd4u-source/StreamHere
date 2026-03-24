"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { heroFeatured, HeroItem } from "@/lib/heroData"

const AUTO_ADVANCE_MS = 7000   // 7 seconds per slide

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Touch handlers
  const touchStartX = useRef<number>(0)
  const touchEndX   = useRef<number>(0)

  function handleTouchStart(e: React.TouchEvent) {
    setIsPaused(true)
    touchStartX.current = e.changedTouches[0].screenX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    setIsPaused(false)
    touchEndX.current = e.changedTouches[0].screenX
    const delta = touchStartX.current - touchEndX.current
    if (Math.abs(delta) < 50) return    // ignore small movements
    if (delta > 0) {
      goTo((current + 1) % heroFeatured.length)   // swipe left → next
    } else {
      goTo((current - 1 + heroFeatured.length) % heroFeatured.length)  // swipe right → prev
    }
  }

  const goTo = useCallback((index: number) => {
    if (index === current || transitioning) return
    setPrev(current)
    setTransitioning(true)
    setCurrent(index)
    setTimeout(() => {
      setPrev(null)
      setTransitioning(false)
    }, 700)   // match CSS transition duration
  }, [current, transitioning])

  const goNext = useCallback(() => {
    goTo((current + 1) % heroFeatured.length)
  }, [current, goTo])

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;

    const reducedMotion = typeof window !== 'undefined' ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
    if (!reducedMotion) {
      timerRef.current = setTimeout(goNext, AUTO_ADVANCE_MS)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, goNext, isPaused])

  const item = heroFeatured[current]

  return (
    <section 
      className="hero-banner" 
      aria-label="Featured anime"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >

      {/* ── BACKDROP LAYERS ─────────────────────────── */}
      {heroFeatured.map((slide, i) => (
        <div
          key={slide.id}
          className={`hero-backdrop-layer ${
            i === current ? "active" :
            i === prev ? "prev" : "hidden"
          }`}
          aria-hidden="true"
        >
          <Image
            src={slide.backdropUrl}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 20%" }}
          />
        </div>
      ))}

      {/* ── GRADIENT OVERLAYS ────────────────────────── */}
      <div className="hero-gradient-left"  aria-hidden="true" />
      <div className="hero-gradient-bottom" aria-hidden="true" />

      {/* ── CONTENT ─────────────────────────────────── */}
      <div className="hero-content">

        {/* Badge */}
        {item.badge && (
          <span className="hero-badge">{item.badge}</span>
        )}

        {/* Title */}
        <h1 className="hero-title">{item.title}</h1>

        {/* Meta row */}
        <div className="hero-meta">
          <span className="hero-meta-item">{item.year}</span>
          {item.episodeCount && (
            <span className="hero-meta-item">{item.episodeCount} Episodes</span>
          )}
          {item.rating && (
            <span className="hero-meta-item hero-meta-rating">{item.rating}</span>
          )}
          <div className="hero-genres">
            {item.genres.map(g => (
              <span key={g} className="hero-genre-tag">{g}</span>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="hero-description">{item.description}</p>

        {/* CTA Buttons */}
        <div className="hero-cta-row">
          <Link href={item.watchUrl} className="hero-btn-primary">
            <PlayIcon />
            Watch Now
          </Link>
          <Link href={item.titleUrl} className="hero-btn-secondary">
            More Info
          </Link>
        </div>
      </div>

      {/* ── SLIDE NAVIGATION ────────────────────────── */}
      <div className="hero-nav">

        {/* Progress bar for current slide */}
        <div className="hero-progress-bar">
          <div
            key={current}   /* key change restarts animation */
            className="hero-progress-fill"
            style={{ animationDuration: `${AUTO_ADVANCE_MS}ms` }}
          />
        </div>

        {/* Thumbnail dots */}
        <div className="hero-dots" role="tablist" aria-label="Featured titles">
          {heroFeatured.map((slide, i) => (
            <button
              key={slide.id}
              role="tab"
              aria-selected={i === current}
              aria-label={`View ${slide.title}`}
              className={`hero-dot ${i === current ? "active" : ""}`}
              onClick={() => goTo(i)}
            >
              <div className="hero-dot-thumb">
                <Image
                  src={slide.posterUrl}
                  alt={slide.title}
                  fill
                  sizes="56px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="hero-dot-label">{slide.title}</span>
            </button>
          ))}
        </div>

        {/* Prev / Next arrows */}
        <div className="hero-arrows">
          <button
            className="hero-arrow"
            onClick={() => goTo((current - 1 + heroFeatured.length) % heroFeatured.length)}
            aria-label="Previous"
          >
            <ChevronLeftIcon />
          </button>
          <button
            className="hero-arrow"
            onClick={goNext}
            aria-label="Next"
          >
            <ChevronRightIcon />
          </button>
        </div>

      </div>
    </section>
  )
}

// ── SVG ICONS ────────────────────────────────────────
function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3 2.5l10 5.5-10 5.5V2.5z"/>
    </svg>
  )
}
function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4L6 9l5 5"/>
    </svg>
  )
}
function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4l5 5-5 5"/>
    </svg>
  )
}
