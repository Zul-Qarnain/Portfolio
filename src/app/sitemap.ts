import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://shihab.vercel.app';
  return [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/posts`, priority: 0.8 },
    { url: `${baseUrl}/projects`, priority: 0.8 },
    { url: `${baseUrl}/publications`, priority: 0.8 },
    { url: `${baseUrl}/events`, priority: 0.8 },
    { url: `${baseUrl}/contact`, priority: 0.8 },
    { url: `${baseUrl}/posts/ai-vs-jobs-is-the-future-human-or-machine`, priority: 0.8 },
  ];
}
