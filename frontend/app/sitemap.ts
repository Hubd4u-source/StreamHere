import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://amaitv.vercel.app';

  // Static routes
  const routes = ['', '/series', '/movies', '/cartoon', '/dmca'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes for all cached animes
  let animeEntries: any[] = [];
  try {
    const { animeCacheService } = await import('@/lib/animeCacheService');
    const animes = await animeCacheService.getAllCached(5000); // Fetch up to 5000 for the sitemap
    animeEntries = animes.map((anime) => ({
      url: `${baseUrl}/title/${anime.id}`,
      lastModified: new Date(anime.updatedAt || anime.lastFetched || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Sitemap: Error fetching dynamic routes', error);
  }

  return [...routes, ...animeEntries];
}
