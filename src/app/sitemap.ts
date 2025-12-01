import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://shihab.vercel.app';

    // Static routes
    const routes = [
        '',
        '/posts',
        '/publications',
        '/projects',
        '/events',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: posts } = await supabase
            .from('blog_posts')
            .select('slug, updated_at')
            .eq('status', 'published');

        const postRoutes = posts?.map((post) => ({
            url: `${baseUrl}/posts/${post.slug}`,
            lastModified: new Date(post.updated_at),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })) || [];

        return [...routes, ...postRoutes];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return routes;
    }
}
