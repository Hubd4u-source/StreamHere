import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://amaitv.vercel.app';

  // Base routes
  const routes = ['', '/series', '/movies', '/cartoon', '/upcoming', '/ongoing', '/dmca'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // Note: For thousands of animes, we technically should fetch them all here.
  // For now, listing the main hubs.
  
  return [...routes];
}
