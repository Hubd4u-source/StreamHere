## AMAI TV – Premium Anime Streaming Platform (Next.js 14 + TypeScript + Firebase)

Full-stack anime streaming platform using Next.js App Router with Firebase authentication, user profiles, watch history, and personalized features. Scraping is implemented in server-side API routes with Axios + Cheerio. Features a premium dark theme with glass morphism effects and anime-themed user avatars.

### Prerequisites
- Node.js 18+
- Firebase project (for authentication and user data)

### Install & Run (Development)
```bash
# from repo root
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

### Environment Variables
- **Required for Firebase:**
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_USE_FIREBASE_EMULATORS` (optional, for local development)

- **Optional:**
  - `NEXT_PUBLIC_SITE_BASE` (default: `https://animesalt.cc`)

### Serverless API Routes (Next.js)
- `GET /api/anime_list?page=1` — paginated list
- `GET /api/anime_details?url=<series_url>[&post_id=<id>][&season=<n>]` — details + seasons + episodes
- `GET /api/episode_players?url=<episode_url>` — video sources (HLS/iframe)
- `GET /api/search?q=<query>` — search (mirrors `animesalt` "?s=")
- `GET /api/image?src=<image_url>` — image proxy
- `GET /api/ongoing?page=<n>&q=<query>` — ongoing series (status: ongoing)
- `GET /api/upcoming` — upcoming episode tiles (with countdowns)

Notes:
- `post_id` improves season switching when provided; direct scraping works without it for default season.
- Selectors depend on `animesalt.cc` markup; adjust in `frontend/server/scraper.ts` if the site changes.

### Frontend Pages
- `/` - Homepage
  - Franchises carousel (Iron Man, Naruto, Dragon Ball, etc.) – large logos, auto-sliding loop
  - Networks grid (Crunchyroll, Netflix, Prime Video, etc.) – internal links only
  - Ongoing Series section (scraped, paginated)
  - Upcoming Episodes section (live countdowns via scraper)
  - Trending, Latest, Popular carousels
- `/search?q=...` - Search results (server-scraped via `/api/search`)
- `/title/<slug>` - Anime details with seasons and episodes (premium dark theme)
- `/watch?...` - Video player with HLS/iframe support, seasons/episodes, and watch history tracking
- `/signin` - Premium authentication page with glass morphism design
- `/profile` - User profile with statistics and anime avatar
- `/my-list` - User's saved anime list with add/remove functionality
- `/watch-history` - User's watch history with progress tracking
- `/cartoon` - Cartoon listing (category scraper)
- `/series` - Series listing (same structure as anime list)
- `/networks` and `/networks/[slug]` - Network hubs and dynamic pages (internal content)
- `/ongoing` - Full ongoing list (search + pagination)

### Code Layout
```
frontend/
  app/                 # App Router pages and API routes
    api/               # Serverless endpoints (scraper wrappers)
    signin/            # Authentication pages
    profile/           # User profile pages
    my-list/           # User's anime list
    watch-history/     # User's watch history
  server/              # Scraper logic (Axios + Cheerio)
  components/          # UI components (cards, sliders, navbar, etc.)
    auth/              # Authentication components
  lib/                 # Utilities (slugs, URLs, Firebase, anime avatars)
  contexts/            # React contexts (AuthContext)
  hooks/               # Custom React hooks
```

Key files:
- `frontend/server/scraper.ts` — core scraping functions
- `frontend/app/api/*` — API endpoints using scraper
- `frontend/lib/firebase.ts` — Firebase configuration and initialization
- `frontend/lib/userDataService.ts` — Firestore operations for user data
- `frontend/lib/animeAvatars.ts` — 11 anime avatar images for user profiles
- `frontend/contexts/AuthContext.tsx` — Firebase authentication context
- `frontend/components/*` — UI building blocks

Notable Components:
- `DesktopNav.tsx` – desktop bottom navigation (visible on PC across pages)
- `NewCarousel.tsx` – smooth auto-sliding carousel with loop and 1-by-1 snap
- `NewAnimeCard.tsx` – premium dark-themed, hover-zoom cards with internal routing
- `DetailsHeader.tsx` – premium dark-themed details header with badges/chips
- `Player.tsx` – video player with watch history tracking
- `UserProfile.tsx` – user profile dropdown with anime avatars
- `AuthModal.tsx` – authentication forms (login, signup, password reset)
- `MyListButton.tsx` – add/remove anime from user's list
- `SmartButtons.tsx` – smart navigation buttons (First, Latest Dub, Latest Sub)

### New Features & Updates

#### 🔐 Authentication System
- **Firebase Authentication** - Email/password and Google sign-in
- **Premium Sign-in Page** - Glass morphism design with animated backgrounds
- **User Profiles** - Complete user management with statistics
- **Session Persistence** - Users stay logged in across sessions

#### 🎌 Anime Avatar System
- **11 Unique Anime Avatars** - Consistent character assignment per user
- **Hash-based Selection** - Same user always gets the same anime character
- **Automatic Assignment** - No Google photos, all users get anime avatars
- **Fallback System** - Graceful fallback to initial letters if images fail

#### 📺 Watch History & Personalization
- **Automatic Watch History** - Episodes automatically added when watching
- **My List Feature** - Save anime to personal watchlist
- **Progress Tracking** - Track watch progress and completion status
- **Cross-device Sync** - Data synced across all devices

#### 🎨 Premium UI/UX
- **Glass Morphism Design** - Modern frosted glass effects
- **Animated Backgrounds** - Subtle gradient orbs and patterns
- **Responsive Design** - Optimized for all screen sizes
- **Dark Theme** - Professional dark color scheme
- **Hover Animations** - Smooth transitions and effects

#### 🚀 Smart Navigation
- **Smart Buttons** - First, Latest Dub, Latest Sub with auto-selection
- **Season Selector** - Modern pill-style buttons with dubbed/subbed indicators
- **Episode Grid** - Responsive grid layout with 16:9 thumbnails
- **Regional Language Notice** - Elegant separator for non-dubbed episodes

### Deployment (Vercel)
1. Set project root to `frontend`
2. Build Command: `npm run build`
3. Output Directory: `.next`
4. **Required Environment Variables:**
   - All Firebase configuration variables (see Environment Variables section)
5. **Optional Environment Variables:**
   - `NEXT_PUBLIC_SITE_BASE`

### Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Set up Firebase Storage (for user avatars)
5. Add all environment variables to Vercel
6. See `frontend/FIREBASE_SETUP.md` for detailed setup instructions

### Troubleshooting
- **Search URL error (ERR_INVALID_URL)**: Ensure you access via `http://localhost:3000`
- **CORS on scraper**: All scraping is server-side via API routes; never call scraper from the client
- **Empty lists/details**: Check API responses; if animesalt markup changes, update parsers in `scraper.ts`
- **HLS not playing**: The default `<video>` plays HLS only with browser support; if needed, integrate `hls.js`
- **Firebase connection issues**: Check environment variables and Firebase project configuration
- **Watch history not saving**: Ensure user is authenticated and Firebase is properly configured
- **Anime avatars not showing**: Check image URLs and network connectivity

### Theming
- **Premium Dark Theme** - Sophisticated gray/slate color palette
- **Glass Morphism Effects** - Frosted glass cards with backdrop blur
- **Subtle Animations** - Pulsing orbs and smooth transitions
- **Consistent Branding** - Anime-themed avatars and professional styling

---

Made by Void Anime

### UI Comparison (Before vs After)

| Old | New |
| --- | --- |
| ![Old UI](https://github.com/Void-Anime/Amai-TV/blob/main/Old.png) | ![New UI](https://github.com/Void-Anime/Amai-TV/blob/main/new.png) |


