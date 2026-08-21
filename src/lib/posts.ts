import { cache } from 'react';
import type { BlogPost } from '@/types/blog';
import { postsData } from '@/lib/postsData';
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase-config';
import {
  buildPostBySlugUrl,
  buildPublishedPostsUrl,
  mapLocalPost,
  normalizePost,
} from '@/lib/posts-utils';

const FETCH_TIMEOUT_MS = 12_000;
const REVALIDATE_SECONDS = 60;

async function fetchJson<T>(url: string): Promise<T> {
  const key = getSupabaseAnonKey();
  const response = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Posts request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function localPublishedPosts(): BlogPost[] {
  return postsData.map(mapLocalPost);
}

export const getPublishedPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const rows = await fetchJson<Array<Partial<BlogPost> & Pick<BlogPost, 'title' | 'slug'>>>(
      buildPublishedPostsUrl(getSupabaseUrl())
    );
    return (rows || []).map(normalizePost);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown posts fetch error';
    console.error('Error fetching posts:', message);
    return localPublishedPosts();
  }
});

export const getPublishedPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const rows = await fetchJson<Array<Partial<BlogPost> & Pick<BlogPost, 'title' | 'slug'>>>(
      buildPostBySlugUrl(getSupabaseUrl(), slug)
    );
    if (rows?.[0]) {
      return normalizePost(rows[0]);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown post fetch error';
    console.error('Error fetching post:', message);
  }

  const local = localPublishedPosts().find((post) => post.slug === slug);
  return local ?? null;
});
