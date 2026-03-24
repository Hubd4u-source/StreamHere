import { NextResponse } from "next/server";
import { fetchAnimeList, searchTMDB } from "@/server/scraper";
import { HeroItem } from "@/lib/heroData";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch popular anime from scraper
    const popularData = await fetchAnimeList(3);
    const popularItems = popularData.items?.slice(0, 6) || [];

    if (popularItems.length === 0) {
      return NextResponse.json({ items: [] });
    }

    // 2. Enhance with TMDB data
    const heroItems: HeroItem[] = await Promise.all(
      popularItems.map(async (item) => {
        const slug = item.url.split('/').filter(Boolean).pop() || '';
        const tmdb = await searchTMDB(item.title || '', 'tv');

        return {
          id: slug,
          title: tmdb?.name || item.title || 'Untitled Anime',
          slug: slug,
          backdropUrl: tmdb?.backdrop_path 
            ? `https://image.tmdb.org/t/p/original${tmdb.backdrop_path}` 
            : 'https://images.unsplash.com/photo-1578632738980-307137ce8706?q=80&w=2000', // Better fallback
          posterUrl: tmdb?.poster_path 
            ? `https://image.tmdb.org/t/p/w342${tmdb.poster_path}` 
            : item.image || '',
          description: tmdb?.overview 
            ? (tmdb.overview.length > 120 ? tmdb.overview.substring(0, 117) + '...' : tmdb.overview)
            : 'Explore the latest episodes of this popular series.',
          genres: tmdb?.genres?.map((g: { name: string }) => g.name).slice(0, 3) || ['Anime', 'Trending'],
          year: tmdb?.first_air_date ? new Date(tmdb.first_air_date).getFullYear() : 2024,
          episodeCount: tmdb?.number_of_episodes || 12,
          badge: 'POPULAR',
          watchUrl: `/watch?episode=${item.url}`,
          titleUrl: `/title/${slug}`,
          rating: tmdb?.vote_average ? tmdb.vote_average.toFixed(1) : undefined
        };
      })
    );

    return NextResponse.json(heroItems);
  } catch (error) {
    console.error("Failed to fetch featured anime:", error);
    return NextResponse.json({ error: "Failed to fetch featured anime" }, { status: 500 });
  }
}
