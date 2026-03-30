import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/watch',
          '/api/',
          '/signin',
          '/profile',
          '/my-list',
          '/watch-history',
          '/admin/',
          '/leaderboard',
          '/test-scraper',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/signin',
          '/profile',
          '/my-list',
          '/watch-history',
          '/admin/',
          '/test-scraper',
        ],
      },
    ],
    sitemap: 'https://amaitv.vercel.app/sitemap.xml',
    host: 'https://amaitv.vercel.app',
  };
}
