import { describe, expect, it } from 'vitest';
import { plainExcerpt, prepareArticle, relatedPosts, slugify } from '@/lib/article';

describe('prepareArticle', () => {
  it('demotes a body-level h1 so the page keeps exactly one h1', () => {
    const { html, headings } = prepareArticle('<blockquote><h1>Lead in</h1><p>hi</p></blockquote>');
    expect(html).not.toContain('<h1');
    expect(html).toContain('<h2');
    expect(headings.map((h) => h.text)).toContain('Lead in');
  });

  it('gives headings anchor ids and preserves existing ones', () => {
    const { html, headings } = prepareArticle('<h2>Jobs AI Is Creating</h2><h3 id="keep">Sub</h3>');
    expect(headings[0].id).toBe('jobs-ai-is-creating');
    expect(html).toContain('id="jobs-ai-is-creating"');
    expect(html).toContain('id="keep"');
    expect(headings[1].id).toBe('keep');
  });

  it('disambiguates repeated heading text', () => {
    const { headings } = prepareArticle('<h2>Overview</h2><h2>Overview</h2>');
    expect(headings.map((h) => h.id)).toEqual(['overview', 'overview-1']);
  });

  it('leaves literal markup inside code samples untouched', () => {
    const { html } = prepareArticle('<pre><code>&lt;h1&gt;title&lt;/h1&gt;</code></pre><h2>Real</h2>');
    expect(html).toContain('<code>&lt;h1&gt;title&lt;/h1&gt;</code>');
    expect(html).toContain('<h2 id="real">Real</h2>');
  });

  it('strips the empty paragraphs the editor leaves behind', () => {
    const { html } = prepareArticle('<p>text</p><p></p><p><br></p><p>more</p>');
    expect(html).not.toMatch(/<p>\s*<\/p>/);
    expect(html).toContain('text');
    expect(html).toContain('more');
  });

  it('adds lazy loading to bare images but not to ones that set it', () => {
    const { html } = prepareArticle('<img src="a.jpg"><img src="b.jpg" loading="eager">');
    expect(html).toContain('src="a.jpg" loading="lazy"');
    expect(html).not.toContain('b.jpg" loading="lazy"');
  });

  it('counts words from visible text only', () => {
    expect(prepareArticle('<p>one two three</p>').wordCount).toBe(3);
  });
});

describe('slugify', () => {
  it('drops emoji and punctuation used in real headings', () => {
    expect(slugify('🤖 Will AI take over jobs—or just change how we work forever?')).toBe(
      'will-ai-take-over-jobsor-just-change-how-we-work-forever',
    );
  });
});

describe('plainExcerpt', () => {
  it('truncates on a word boundary under the 155 character snippet limit', () => {
    const out = plainExcerpt(`<p>${'word '.repeat(80)}</p>`);
    expect(out.length).toBeLessThanOrEqual(155);
    // The cut lands after a whole word, never inside one.
    expect(out).toMatch(/^(word )+word$/);
  });

  it('returns plain text with no markup', () => {
    expect(plainExcerpt('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });
});

describe('relatedPosts', () => {
  const post = (slug: string, tags: string[]) =>
    ({ slug, title: slug, content: '', status: 'published', tags }) as never;

  it('excludes the current post and ranks shared tags first', () => {
    const current = post('a', ['ai', 'jobs']);
    const results = relatedPosts(
      [current, post('b', ['cooking']), post('c', ['ai', 'jobs'])],
      current,
    );
    expect(results.map((p) => p.slug)).toEqual(['c', 'b']);
  });

  it('respects the limit', () => {
    const current = post('a', []);
    const pool = [current, post('b', []), post('c', []), post('d', []), post('e', [])];
    expect(relatedPosts(pool, current, 3)).toHaveLength(3);
  });
});
