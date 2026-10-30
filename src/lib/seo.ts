import type { Metadata } from 'next';

const FALLBACK_SITE_URL = 'https://shihab.vercel.app';

/**
 * NEXT_PUBLIC_SITE_URL is often pasted from the Vercel dashboard with a trailing
 * slash, which turns `${SITE_URL}/posts/x` into `//posts/x`.
 */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
  return raw.replace(/\/+$/, '');
}

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http')) return path;
  return `${siteUrl()}${path.replace(/\/+$/, '') || ''}`;
}

/**
 * Metadata for a static page. A page-level `openGraph` block replaces the
 * root layout's outright, so every field is restated here with this page's
 * own URL — otherwise sub-pages inherit the homepage's og:url/og:title,
 * which confuses link unfurlers and AI systems reading the page.
 */
export function staticPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);
  const base = siteUrl();
  const fullTitle = `${title} | Mohammad Shihab Hossain`;
  const image = `${base}/mypic-square.jpeg`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      title: fullTitle,
      description,
      url,
      siteName: 'Mohammad Shihab Hossain',
      locale: 'en_US',
      images: [{ url: image, width: 1023, height: 1023, alt: 'Mohammad Shihab Hossain' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
