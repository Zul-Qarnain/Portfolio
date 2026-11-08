import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mohammad Shihab Hossain — AI & Software Developer',
    short_name: 'Shihab Hossain',
    description:
      'Portfolio of Mohammad Shihab Hossain: projects, research publications, achievements, skills and articles.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0c0e13',
    theme_color: '#0c0e13',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
