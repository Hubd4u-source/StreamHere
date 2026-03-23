# AMAI TV — UI Redesign Prompt

**Purpose**: A comprehensive, copy-paste-ready prompt for redesigning the AMAI TV
anime streaming platform. Grounded in 2025 dark UI design research, cinematic
streaming platform aesthetics, and your requirement for a minimal, non-neon palette.

---

## The Core Problem (What's Wrong Now)

The current UI has several issues visible in the screenshots:

1. **Pure black (#000000) background** — too harsh, creates jarring contrast
2. **Flat, zero-depth layout** — cards feel like stickers on a wall, no spatial hierarchy
3. **Generic purple buttons** — Sign In / Subscribe buttons clash with no consistent accent system
4. **Crowded franchise cards** — bright isolated character art with no visual cohesion
5. **Network logos section** — mismatched sizes and colors create visual noise
6. **Bottom navigation** — icon-only with no hover/active states, feels like a mobile afterthought
7. **Typography** — no hierarchy, headings and body text have similar visual weight
8. **Card grid** — uniform sizing, no breathing room, no hover interactions

---

## Recommended Design Direction: "Cinematic Obsidian"

Inspired by how **Netflix**, **Criterion Channel**, and **MUBI** handle dark streaming UI —
not flashy, not neon, but deeply cinematic and sophisticated.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#0D0D0F` | Page background (near-black, not pure black) |
| `--bg-surface` | `#141416` | Card backgrounds, navbar |
| `--bg-elevated` | `#1C1C1F` | Hover states, dropdowns, modals |
| `--bg-overlay` | `#242428` | Input fields, selected states |
| `--accent-primary` | `#E8C97A` | Warm gold — CTAs, highlights, active nav (NOT neon) |
| `--accent-secondary` | `#C4956A` | Muted amber — secondary highlights, hover states |
| `--accent-muted` | `#8A6E4A` | Subdued warm tone — badges, tags |
| `--text-primary` | `#F0EDE8` | Off-white headlines (NOT pure white) |
| `--text-secondary` | `#A09990` | Muted warm gray — subtitles, metadata |
| `--text-tertiary` | `#5E5852` | Timestamps, placeholders |
| `--border-subtle` | `#232320` | Card borders, dividers |
| `--border-medium` | `#2E2D28` | Hover borders |

**Why this works**: The warm gold accent (`#E8C97A`) evokes the quality of film/cinema
without being neon or aggressive. The near-black backgrounds (`#0D0D0F`) are softer than
pure black and feel more premium. Off-white text (`#F0EDE8`) is easier on the eyes during
long browsing sessions.

**What to avoid**: No `#FF0000` red, no `#00FFFF` cyan, no `#9B59B6` purple as the main
accent. No glowing borders or neon outlines anywhere.

---

## Full Redesign Prompt

Use this prompt in your AI coding tool or give it directly to a developer:

---

```
You are redesigning the AMAI TV anime streaming website (a Next.js 14 app).
The current design uses a flat pure-black (#000000) background with generic purple
buttons and no visual depth. Transform it into a cinematic, premium dark-mode
streaming platform in the style of Criterion Channel and MUBI — sophisticated,
minimal, warm. No neon. No gradients on UI elements. No glassmorphism.

=== DESIGN SYSTEM ===

Define these CSS custom properties in :root and use them everywhere. Never hardcode
hex values in components.

:root {
  --bg-base: #0D0D0F;
  --bg-surface: #141416;
  --bg-elevated: #1C1C1F;
  --bg-overlay: #242428;

  --accent: #E8C97A;
  --accent-hover: #D4B568;
  --accent-muted: #8A6E4A;

  --text-primary: #F0EDE8;
  --text-secondary: #A09990;
  --text-tertiary: #5E5852;

  --border-subtle: #232320;
  --border-medium: #2E2D28;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;

  --transition: 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

=== TYPOGRAPHY ===

Use the font pairing: 'DM Sans' (body, UI labels, nav) + 'Playfair Display' (section
headings like "Franchises", "Networks", "Series"). Import both from Google Fonts.

Font scale:
- Display heading (hero text): 32px / 700 / letter-spacing -0.02em / var(--text-primary)
- Section heading: 22px / 600 / font: 'Playfair Display' / var(--text-primary)
- Section subtitle: 14px / 400 / var(--text-secondary)
- Card title: 14px / 500 / var(--text-primary)
- Card metadata (genre, year): 12px / 400 / var(--text-tertiary)
- Nav item: 14px / 400 / var(--text-secondary) → hover: var(--text-primary)
- Button text: 13px / 500 / letter-spacing 0.02em

=== NAVBAR ===

Replace the current flat dark bar with:
- background: var(--bg-surface)
- border-bottom: 1px solid var(--border-subtle)
- Padding: 0 48px, height: 64px
- Logo: keep "A" icon + "AMAI TV" text, make it var(--text-primary)
- Nav links (Home, Anime, Movies, Genres): var(--text-secondary), no underlines,
  hover → var(--text-primary), active → var(--accent) with a 2px bottom border in var(--accent)
- Search icon: var(--text-tertiary), hover: var(--text-primary)
- "Sign In" button: transparent bg, 1px border var(--border-medium), text var(--text-secondary),
  hover → bg var(--bg-elevated), text var(--text-primary). border-radius var(--radius-sm)
- "Subscribe" button: bg var(--accent), text #0D0D0F (dark text on gold), font-weight 600,
  border-radius var(--radius-sm), hover → bg var(--accent-hover), NO box-shadow, NO glow

=== FRANCHISE CARDS (Homepage) ===

The section heading "Franchises / Tap a logo to search" should be:
- "Franchises" in Playfair Display 22px var(--text-primary)
- "Tap a logo to search" in 13px var(--text-tertiary) below, not inline

Each franchise card:
- Remove the colorful arched backgrounds (orange, blue, red). Replace with a unified card.
- Card container: bg var(--bg-surface), border 1px solid var(--border-subtle),
  border-radius var(--radius-lg), width 160px, padding 16px
- Character image: centered, max-height 140px, object-fit contain
- Franchise name below image: 11px / 600 / letter-spacing 0.08em / UPPERCASE / var(--accent)
- Full name below that: 12px / 400 / var(--text-secondary)
- On hover: border-color → var(--accent-muted), transform: translateY(-3px),
  transition: var(--transition). No glow, no box-shadow.

=== SERIES / MOVIE CARDS ===

Standard content cards used in /series, /movies, and carousels:
- Container: border-radius var(--radius-md), overflow hidden, cursor pointer
- Thumbnail: aspect-ratio 2/3 (poster), width 100%, object-fit cover
- Below thumbnail: padding 8px 0
- Title: 13px / 500 / var(--text-primary), max 2 lines, overflow ellipsis
- Metadata line (genre · year): 11px / 400 / var(--text-tertiary)
- On hover:
  - Thumbnail overlay: a 0.35 opacity rgba(0,0,0,0.35) overlay fades in
  - Play icon (▶) centered white 20px, appears on hover
  - Title color → var(--accent)
  - NO scale transform (it looks cheap at grid density)
- No card background needed below the thumbnail — let bg-base show through

=== NETWORK LOGOS SECTION ===

Section heading: "Networks" in Playfair Display + subtitle in var(--text-tertiary)
Logo grid: display flex, flex-wrap wrap, gap 12px, justify-content center
Each logo pill:
- bg var(--bg-surface), border 1px solid var(--border-subtle)
- border-radius var(--radius-md), padding 12px 20px
- width 80px height 80px, display flex, align-items center, justify-content center
- img: max-width 56px, max-height 40px, object-fit contain, filter: grayscale(20%)
- On hover: border-color var(--border-medium), filter: grayscale(0%), transition var(--transition)

=== BOTTOM NAVIGATION (mobile) ===

- bg: var(--bg-surface), border-top: 1px solid var(--border-subtle)
- Each nav item: icon + label below (12px / 400)
- Inactive: icon + label both var(--text-tertiary)
- Active: icon var(--accent), label var(--accent), 13px / 500
- No colored backgrounds behind active icon, just the accent color on the icon itself

=== SEARCH BAR (/series, /movies pages) ===

- bg: var(--bg-elevated), border: 1px solid var(--border-subtle)
- border-radius: 8px, padding: 10px 16px, width: 100%, max-width: 520px
- placeholder color: var(--text-tertiary)
- text color: var(--text-primary)
- focus: border-color var(--border-medium), outline: none (no blue glow)
- Search icon inside: var(--text-tertiary)

=== PAGE-LEVEL SPACING ===

- Max content width: 1280px, margin auto, padding 0 48px (desktop), 0 20px (mobile)
- Section vertical spacing: 64px between sections
- Card grids: gap 16px (desktop), 12px (mobile)
- Section header to grid: 24px margin-bottom

=== SCROLL BEHAVIOR ===

Franchise carousel:
- Hide the native scrollbar (scrollbar-width: none)
- Add left/right arrow buttons (32px circle, bg var(--bg-elevated), border var(--border-subtle),
  icon var(--text-secondary)), appear on hover of the section, hidden on mobile

=== WHAT NOT TO DO ===

1. Do NOT add any glowing effects, neon outlines, or colored box-shadows
2. Do NOT use purple as an accent color anywhere
3. Do NOT add gradient backgrounds to any UI element (gradients only allowed on
   image overlays like the hover thumbnail overlay)
4. Do NOT use pure white (#FFFFFF) or pure black (#000000) anywhere in the design
5. Do NOT add glassmorphism (backdrop-filter blur) to any panel
6. Do NOT animate on page load (no entrance animations, keep it fast and clean)
7. Do NOT make the subscribe button larger or more prominent than the sign-in button
   — they should feel like a family, just with different weights

=== FILES TO MODIFY ===

Priority order:
1. globals.css or tailwind.config.js — add the full design system tokens above
2. NewNavbar.tsx — apply the navbar rules
3. NewAnimeCard.tsx — apply the card hover/layout rules
4. Homepage page.tsx — franchise cards, network logos, section headings
5. /series/page.tsx and /movies/page.tsx — search bar, grid, page spacing
```

---

## Optional: Tailwind Config Version

If the project uses Tailwind CSS, add this to `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      bg: {
        base:     '#0D0D0F',
        surface:  '#141416',
        elevated: '#1C1C1F',
        overlay:  '#242428',
      },
      accent: {
        DEFAULT: '#E8C97A',
        hover:   '#D4B568',
        muted:   '#8A6E4A',
      },
      content: {
        primary:   '#F0EDE8',
        secondary: '#A09990',
        tertiary:  '#5E5852',
      },
      border: {
        subtle: '#232320',
        medium: '#2E2D28',
      },
    },
    fontFamily: {
      sans:    ['"DM Sans"', 'sans-serif'],
      display: ['"Playfair Display"', 'serif'],
    },
  }
}
```

---

## Reference Inspiration

| Platform | What to borrow |
|---|---|
| **MUBI** | Warm typography, editorial card spacing, serif section headers |
| **Criterion Channel** | Minimal nav, zero visual clutter, content-first grid |
| **Netflix** | Hover play overlay behavior, smooth card interactions |
| **Apple TV+** | Off-white text, generous padding, gold/amber accents |

---

## Summary of Changes

| Before | After |
|---|---|
| Pure black `#000000` background | Near-black `#0D0D0F` with warm undertone |
| Generic purple CTA buttons | Gold/amber `#E8C97A` accents, dark text on button |
| Colorful character card backgrounds | Unified dark surface cards, character art only |
| Pure white body text | Off-white `#F0EDE8`, easier for extended reading |
| Flat typography, one weight | DM Sans body + Playfair Display headings |
| No hover states on cards | Subtle overlay + play icon on hover |
| Mismatched network logo sizes | Uniform pill containers with consistent sizing |
| Neon/glowing borders | Thin 1px muted borders only |
