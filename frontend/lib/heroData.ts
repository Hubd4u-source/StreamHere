// lib/heroData.ts

export interface HeroItem {
  id: string
  title: string               // Formatted display title e.g. "Spy × Family"
  slug: string                // URL slug e.g. "spy-x-family"
  backdropUrl: string         // Wide landscape image (16:9 or wider)
  posterUrl: string           // Portrait poster (2:3) — used in nav thumbnails
  description: string         // 1–2 sentence synopsis, max 120 chars
  genres: string[]            // e.g. ["Action", "Comedy", "Slice of Life"]
  year: number
  rating?: string             // e.g. "PG-13"
  episodeCount?: number
  badge?: string              // e.g. "NEW SEASON" | "TRENDING" | "TOP RATED"
  watchUrl: string            // Direct link to first episode
  titleUrl: string            // Link to title detail page
}

export const heroFeatured: HeroItem[] = [
  {
    "id": "solo-leveling",
    "title": "Solo Leveling",
    "slug": "solo-leveling",
    "backdropUrl": "https://image.tmdb.org/t/p/original/xMNH87maNLt9n2bMDYeI6db5VFm.jpg",
    "posterUrl": "https://image.tmdb.org/t/p/w342/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg",
    "description": "Sung Jinwoo, known as the world's weakest hunter, gains a mysterious leveling system that allows him to transform his life and powers.",
    "genres": [
      "Action",
      "Adventure",
      "Fantasy"
    ],
    "year": 2024,
    "episodeCount": 25,
    "badge": "TRENDING",
    "watchUrl": "/watch?episode=/episode/solo-leveling-1x1/",
    "titleUrl": "/title/solo-leveling",
    "rating": "8.6"
  },
  {
    "id": "one-piece",
    "title": "One Piece",
    "slug": "one-piece",
    "backdropUrl": "https://image.tmdb.org/t/p/original/2rmK7mnchw9Xr3XdiTFSxTTLXqv.jpg",
    "posterUrl": "https://image.tmdb.org/t/p/w342/uiIB9ctqZFbfRXXimtpmZb5dusi.jpg",
    "description": "Monkey D. Luffy and his pirate crew search for the ultimate treasure to become the next King of the Pirates.",
    "genres": [
      "Action & Adventure",
      "Comedy"
    ],
    "year": 1999,
    "episodeCount": 1155,
    "badge": "TOP RATED",
    "watchUrl": "/watch?episode=/episode/one-piece-1x1/",
    "titleUrl": "/title/one-piece",
    "rating": "8.7"
  },
  {
    "id": "demon-slayer",
    "title": "Demon Slayer: Kimetsu no Yaiba",
    "slug": "demon-slayer",
    "backdropUrl": "https://image.tmdb.org/t/p/original/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg",
    "posterUrl": "https://image.tmdb.org/t/p/w342/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
    "description": "Tanjiro Kamado embarks on a perilous journey to find a cure for his sister and avenge his family who were slain by demons.",
    "genres": [
      "Action & Adventure",
      "Animation",
      "Sci-Fi & Fantasy"
    ],
    "year": 2019,
    "episodeCount": 63,
    "badge": "NEW SEASON",
    "watchUrl": "/watch?episode=/episode/demon-slayer-1x1/",
    "titleUrl": "/title/demon-slayer",
    "rating": "8.6"
  },
  {
    "id": "jujutsu-kaisen",
    "title": "JUJUTSU KAISEN",
    "slug": "jujutsu-kaisen",
    "backdropUrl": "https://image.tmdb.org/t/p/original/gmECX1DvFgdUPjtio2zaL8BPYPu.jpg",
    "posterUrl": "https://image.tmdb.org/t/p/w342/fHpKWq9ayzSk8nSwqRuaAUemRKh.jpg",
    "description": "After consuming a legendary cursed object, Yuji Itadori joins a secret organization of sorcerers to fight against dangerous curses.",
    "genres": [
      "Action & Adventure",
      "Animation",
      "Sci-Fi & Fantasy"
    ],
    "year": 2020,
    "episodeCount": 59,
    "badge": "POPULAR",
    "watchUrl": "/watch?episode=/episode/jujutsu-kaisen-1x1/",
    "titleUrl": "/title/jujutsu-kaisen",
    "rating": "8.6"
  },
  {
    "id": "spy-x-family",
    "title": "SPY x FAMILY",
    "slug": "spy-x-family",
    "backdropUrl": "https://image.tmdb.org/t/p/original/lysUnU6V0VfcthDbviuVlIqgHOR.jpg",
    "posterUrl": "https://image.tmdb.org/t/p/w342/7NAvPYPAu7MeHwP8E9sn81PqsRh.jpg",
    "description": "A spy, an assassin, and a telepath pose as a family while hiding their true identities from each other to maintain peace between nations.",
    "genres": [
      "Animation",
      "Comedy",
      "Action & Adventure"
    ],
    "year": 2022,
    "episodeCount": 50,
    "badge": "SEASON 3",
    "watchUrl": "/watch?episode=/episode/spy-x-family-1x1/",
    "titleUrl": "/title/spy-x-family",
    "rating": "8.5"
  },
  {
    "id": "mashle",
    "title": "MASHLE: MAGIC AND MUSCLES",
    "slug": "mashle",
    "backdropUrl": "https://image.tmdb.org/t/p/original/p1swd15DRtCnNj20U904dbXeVsi.jpg",
    "posterUrl": "https://image.tmdb.org/t/p/w342/yORTvQOQTZzZ9JRIpRH4QaIaQBm.jpg",
    "description": "In a world where magic is everything, a young man born without magic must use his sheer physical strength to protect his peaceful life.",
    "genres": [
      "Animation",
      "Action & Adventure",
      "Comedy"
    ],
    "year": 2023,
    "episodeCount": 24,
    "badge": "MUST WATCH",
    "watchUrl": "/watch?episode=/episode/mashle-1x1/",
    "titleUrl": "/title/mashle",
    "rating": "8.3"
  }
];
