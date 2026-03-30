import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AMAI TV — Watch Anime Online Free',
    short_name: 'AMAI TV',
    description:
      'Watch anime online free in Hindi dubbed and English subbed. HD quality streaming with new episodes daily.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D0D0F',
    theme_color: '#0D0D0F',
    orientation: 'portrait-primary',
    categories: ['entertainment', 'video'],
    icons: [
      {
        src: '/favicon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/favicon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
