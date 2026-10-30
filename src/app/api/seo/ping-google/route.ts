import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getPublishedPosts } from '@/lib/posts';
import { siteUrl } from '@/lib/seo';

// IndexNow key. Public by design: the key file is served at /<key>.txt so
// Bing/Yandex can verify ownership. Same key as src/scripts/submit-indexnow.ts.
const INDEXNOW_KEY = '9f6c1fc962ee4cc8a182f31aafb11c69';

// Mirrors src/app/sitemap.ts static entries (excludes /events: noindex).
const STATIC_PATHS = [
  '/',
  '/posts',
  '/projects',
  '/skills',
  '/publications',
  '/achievements',
  '/contact',
];

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('Authentication failed:', authError?.message || 'No user found');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const base = siteUrl();
    const host = base.replace(/^https?:\/\//, '');

    let postPaths: string[] = [];
    try {
      const posts = await getPublishedPosts();
      postPaths = posts.map((post) => `/posts/${post.slug}`);
    } catch (error) {
      console.warn('Failed to load posts for IndexNow submission:', error);
    }

    const urlList = [...STATIC_PATHS, ...postPaths].map((path) =>
      path === '/' ? `${base}/` : `${base}${path}`,
    );

    // Google retired its sitemap ping endpoint in 2023 and Bing's ping is
    // deprecated, so notify via IndexNow (Bing, Yandex, Seznam, Naver).
    // Google picks the URLs up from the submitted sitemap + normal crawl.
    const payload = {
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${base}/${INDEXNOW_KEY}.txt`,
      urlList,
    };

    try {
      const response = await fetch('https://api.indexnow.org/IndexNow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });
      console.log('IndexNow response:', response.status);
      if (response.status !== 200 && response.status !== 202) {
        const text = await response.text().catch(() => '');
        console.warn('IndexNow submission rejected:', text);
        return NextResponse.json(
          { ok: false, status: response.status, submitted: 0 },
          { status: 502 },
        );
      }
    } catch (error) {
      console.warn('Failed to submit to IndexNow:', error);
      return NextResponse.json(
        { ok: false, submitted: 0 },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, submitted: urlList.length });
  } catch (error) {
    console.error('Error notifying search engines:', error);
    return new NextResponse('Error notifying search engines', { status: 500 });
  }
}
