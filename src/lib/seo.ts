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
