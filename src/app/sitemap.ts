import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://shihab.vercel.app';
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lzvxpamfvfzkchbqfxgt.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dnhwYW1mdmZ6a2NoYnFmeGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjExNDQsImV4cCI6MjA2NDUzNzE0NH0.BxvV5yhtvjELIU3mcWbjTwrxXAZRgARY2OKivQ6JdNs';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  let postUrls: MetadataRoute.Sitemap = [];
  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published');
      
    if (posts) {
      postUrls = posts.map(post => ({
        url: `${baseUrl}/posts/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap posts:', error);
  }

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/posts`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/publications`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
  ];

  return [...staticPages, ...postUrls];
}
