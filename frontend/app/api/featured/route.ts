import { NextResponse } from "next/server";
import { fetchAnimeList, searchTMDB, fetchAnimeDetails } from "@/server/scraper";
import { HeroItem } from "@/lib/heroData";

export const dynamic = 'force-dynamic';

function cleanTitle(text: string): string {
  if (!text) return "";
  // Removes emojis, gender symbols (♀, ♂), and extra whitespace
  return text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}]/gu, "")
    .replace(/[♀♂]/g, "")
    .trim();
}

export async function GET() {
  try {
    // 1. Fetch more popular anime from scraper to allow for filtering
    const popularData = await fetchAnimeList(3);
    const rawItems = popularData.items?.slice(0, 12) || [];

    if (rawItems.length === 0) {
      return NextResponse.json({ items: [] });
    }

    // 2. Enhance with TMDB data AND verify availability in scraper
    const heroItems: HeroItem[] = (await Promise.all(
      rawItems.map(async (item): Promise<HeroItem | null> => {
        if (!item.title || !item.url) return null;
        
        try {
          // Verify series actually has content/episodes
          const details = await fetchAnimeDetails({ 
            url: item.url, 
            postId: item.postId || 0 
          });

          // Skip if no episodes are found (not "available")
          if (!details.episodes || details.episodes.length === 0) {
            console.log(`Skipping ${item.title}: No episodes found in scraper.`);
            return null;
          }

          const rawSlug = item.url.split('/').filter(Boolean).pop() || '';
          const slug = cleanTitle(rawSlug);
          const tmdb = await searchTMDB(item.title, 'tv');

          return {
            id: slug,
            title: cleanTitle(tmdb?.name || item.title),
            slug: slug,
            backdropUrl: tmdb?.backdrop_path 
              ? `https://image.tmdb.org/t/p/original${tmdb.backdrop_path}` 
              : 'https://images.unsplash.com/photo-1578632738980-307137ce8706?q=80&w=2000',
            posterUrl: tmdb?.poster_path 
              ? `https://image.tmdb.org/t/p/w342${tmdb.poster_path}` 
              : item.image || '',
            description: tmdb?.overview 
              ? (tmdb.overview.length > 120 ? tmdb.overview.substring(0, 117) + '...' : tmdb.overview)
              : 'Explore the latest episodes of this popular series.',
            genres: tmdb?.genres?.map((g: { name: string }) => g.name).slice(0, 3) || ['Anime', 'Trending'],
            year: tmdb?.first_air_date ? new Date(tmdb.first_air_date).getFullYear() : 2024,
            episodeCount: tmdb?.number_of_episodes || details.episodes.length,
            badge: 'POPULAR',
            watchUrl: `/watch?episode=${encodeURIComponent(item.url)}`,
            titleUrl: `/title/${encodeURIComponent(slug)}`,
            rating: tmdb?.vote_average ? tmdb.vote_average.toFixed(1) : undefined
          };
        } catch (error) {
          console.error(`Error processing individual item ${item.title}:`, error);
          return null;
        }
      })
    ))
    .filter((item): item is HeroItem => item !== null)
    .slice(0, 6); // Final limited set for the UI

    return NextResponse.json(heroItems);
  } catch (error) {
    console.error("Failed to fetch featured anime:", error);
    return NextResponse.json({ error: "Failed to fetch featured anime" }, { status: 500 });
  }
}
