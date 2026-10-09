import { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/posts';
import { siteUrl } from '@/lib/seo';

// Fixed at build time so <lastmod> does not claim every page was rewritten
// each time the sitemap is revalidated.
const BUILT_AT = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl();

  let postUrls: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedPosts();
    postUrls = posts.map((post) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : BUILT_AT,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error generating dynamic sitemap posts:', error);
  }

  // /events is intentionally absent: it renders a filtered view of
  // /achievements and self-canonicalises to /achievements?category=event, so
  // listing it would submit a duplicate URL.
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: BUILT_AT,
      changeFrequency: 'daily' as const,
      priority: 1.0,
      images: [
        `${baseUrl}/mypic-square.jpeg`,
        `${baseUrl}/mypic.jpeg`,
      ],
    },
    { url: `${baseUrl}/posts`, lastModified: BUILT_AT, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: BUILT_AT, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/skills`, lastModified: BUILT_AT, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/publications`, lastModified: BUILT_AT, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/achievements`, lastModified: BUILT_AT, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: BUILT_AT, changeFrequency: 'monthly' as const, priority: 0.8 },
  ];

  return [...staticPages, ...postUrls];
}
