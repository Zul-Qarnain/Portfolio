import type { BlogPost } from '@/types/blog';
import type { Post } from '@/lib/postsData';

export const POST_LIST_COLUMNS =
  'id,title,slug,excerpt,meta_description,featured_image_url,published_at,created_at,updated_at,views_count,reading_time,featured,tags,status';

export function buildPublishedPostsUrl(baseUrl: string, columns = POST_LIST_COLUMNS): string {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const url = new URL(`${normalizedBase}/rest/v1/blog_posts`);
  url.searchParams.set('select', columns);
  url.searchParams.set('status', 'eq.published');
  url.searchParams.set('order', 'published_at.desc');
  return url.toString();
}

export function buildPostBySlugUrl(baseUrl: string, slug: string): string {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const url = new URL(`${normalizedBase}/rest/v1/blog_posts`);
  url.searchParams.set('select', '*');
  url.searchParams.set('slug', `eq.${slug}`);
  url.searchParams.set('status', 'eq.published');
  url.searchParams.set('limit', '1');
  return url.toString();
}

export function normalizePost(post: Partial<BlogPost> & Pick<BlogPost, 'title' | 'slug'>): BlogPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content || '',
    excerpt: post.excerpt,
    meta_description: post.meta_description,
    meta_keywords: post.meta_keywords,
    featured_image_url: post.featured_image_url || '',
    author_id: post.author_id,
    status: post.status || 'published',
    published_at: post.published_at ?? null,
    created_at: post.created_at,
    updated_at: post.updated_at,
    views_count: post.views_count ?? 0,
    reading_time: post.reading_time ?? 0,
    featured: Boolean(post.featured),
    tags: Array.isArray(post.tags) ? post.tags : [],
  };
}

export function mapLocalPost(post: Post): BlogPost {
  const publishedAt = new Date(post.date).toISOString();
  return normalizePost({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.description,
    meta_description: post.description,
    featured_image_url: post.images[0] || '',
    author_id: 'local',
    status: 'published',
    published_at: publishedAt,
    created_at: publishedAt,
    updated_at: publishedAt,
    views_count: 0,
    reading_time: Math.max(1, Math.round(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)),
    featured: false,
    tags: ['Technology', 'Programming'],
  });
}
