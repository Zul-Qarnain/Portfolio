import { describe, expect, it } from 'vitest';
import { postsData } from '@/lib/postsData';
import {
  buildPostBySlugUrl,
  buildPublishedPostsUrl,
  mapLocalPost,
  normalizePost,
  POST_LIST_COLUMNS,
} from '@/lib/posts-utils';

describe('posts URL builders', () => {
  it('builds a published posts REST url with list columns', () => {
    const url = buildPublishedPostsUrl('https://example.supabase.co/');
    expect(url).toContain('https://example.supabase.co/rest/v1/blog_posts');
    expect(url).toContain('status=eq.published');
    expect(url).toContain('order=published_at.desc');
    expect(decodeURIComponent(url)).toContain(`select=${POST_LIST_COLUMNS}`);
  });

  it('builds a slug lookup url', () => {
    const url = buildPostBySlugUrl('https://example.supabase.co', 'hello-world');
    expect(url).toContain('slug=eq.hello-world');
    expect(url).toContain('limit=1');
  });
});

describe('post normalizers', () => {
  it('fills missing tags and content', () => {
    const post = normalizePost({
      title: 'Hello',
      slug: 'hello',
    });
    expect(post.tags).toEqual([]);
    expect(post.content).toBe('');
    expect(post.status).toBe('published');
    expect(post.views_count).toBe(0);
  });

  it('maps local fallback posts into the blog shape', () => {
    const mapped = mapLocalPost(postsData[0]);
    expect(mapped.slug).toBe(postsData[0].slug);
    expect(mapped.title).toBe(postsData[0].title);
    expect(mapped.status).toBe('published');
    expect(mapped.tags.length).toBeGreaterThan(0);
    expect(mapped.reading_time).toBeGreaterThan(0);
  });
});
