import { afterEach, describe, expect, it, vi } from 'vitest';
import { absoluteUrl, siteUrl, staticPageMetadata } from '@/lib/seo';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('siteUrl', () => {
  it('falls back to the production host', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    expect(siteUrl()).toBe('https://shihab.vercel.app');
  });

  it('strips a trailing slash from a pasted env value', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com/');
    expect(siteUrl()).toBe('https://example.com');
  });
});

describe('absoluteUrl', () => {
  it('joins host and path', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com');
    expect(absoluteUrl('/posts/hello')).toBe('https://example.com/posts/hello');
  });

  it('leaves absolute urls alone', () => {
    expect(absoluteUrl('https://other.dev/x')).toBe('https://other.dev/x');
  });
});

describe('staticPageMetadata', () => {
  it('sets a page-specific canonical and og url', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com');
    const meta = staticPageMetadata({
      title: 'Projects',
      description: 'Things built.',
      path: '/projects',
    });
    expect(meta.alternates?.canonical).toBe('/projects');
    const og = meta.openGraph;
    if (og && 'url' in og) {
      expect(og.url).toBe('https://example.com/projects');
    } else {
      throw new Error('expected openGraph.url');
    }
  });
});
