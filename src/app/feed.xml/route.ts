import { getPublishedPosts } from '@/lib/posts';
import { plainExcerpt } from '@/lib/article';
import { siteUrl } from '@/lib/seo';

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const base = siteUrl();
  const posts = await getPublishedPosts().catch(() => []);

  const items = posts
    .map((post) => {
      const url = `${base}/posts/${post.slug}`;
      const description =
        post.meta_description?.trim() || plainExcerpt(post.content, 280);
      const pubDate = post.published_at
        ? new Date(post.published_at).toUTCString()
        : null;
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : null,
        `      <description>${escapeXml(description)}</description>`,
        ...(post.tags ?? []).map(
          (tag) => `      <category>${escapeXml(tag)}</category>`,
        ),
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    '    <title>Mohammad Shihab Hossain — Writing</title>',
    `    <link>${escapeXml(`${base}/posts`)}</link>`,
    '    <description>Articles on AI, machine learning, mathematics and programming by Mohammad Shihab Hossain.</description>',
    '    <language>en-us</language>',
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control':
        'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
