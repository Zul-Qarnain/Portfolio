import type { BlogPost } from '@/types/blog';

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface PreparedArticle {
  html: string;
  headings: ArticleHeading[];
  wordCount: number;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function toText(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/**
 * Code samples can contain literal markup such as `<h1>`, so pre/code regions
 * are parked before rewriting and restored afterwards.
 */
function park(src: string, tag: RegExp, bag: string[]): string {
  return src.replace(tag, (match) => {
    bag.push(match);
    return `\u0000${bag.length - 1}\u0000`;
  });
}

function restore(src: string, bag: string[]): string {
  return src.replace(/\u0000(\d+)\u0000/g, (_, i) => bag[Number(i)] ?? '');
}

/**
 * The page already renders the article title as the sole `<h1>`, so a stray
 * `<h1>` inside the stored body is demoted rather than dropped. Empty paragraphs
 * left behind by the editor are removed, and bare `<img>` tags get intrinsic
 * dimensions plus lazy decoding so they cannot shift the layout.
 */
export function prepareArticle(content: string): PreparedArticle {
  const bag: string[] = [];
  let html = park(content || '', /<pre[\s\S]*?<\/pre>/gi, bag);
  html = park(html, /<code[\s\S]*?<\/code>/gi, bag);

  html = html
    .replace(/<h1(?=[\s>])/gi, '<h2')
    .replace(/<\/h1\s*>/gi, '</h2>')
    .replace(/<p>\s*(?:<br\s*\/?>)?\s*<\/p>/gi, '')
    .replace(/<img([^>]*)>/gi, (match, attrs: string) => {
      const extra =
        `${/loading\s*=/i.test(attrs) ? '' : ' loading="lazy"'}` +
        `${/decoding\s*=/i.test(attrs) ? '' : ' decoding="async"'}`;
      return extra ? `<img${attrs}${extra}>` : match;
    });

  const headings: ArticleHeading[] = [];
  const seen = new Map<string, number>();

  html = html.replace(/<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, inner) => {
    const text = toText(inner);
    if (!text) return match;

    const existing = /id\s*=\s*"([^"]+)"/i.exec(attrs || '')?.[1];
    if (existing) {
      seen.set(existing, (seen.get(existing) ?? 0) + 1);
      headings.push({ id: existing, text, level: Number(level) as 2 | 3 });
      return match;
    }

    let id = slugify(text);
    if (!id) id = `section-${headings.length + 1}`;
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;

    headings.push({ id, text, level: Number(level) as 2 | 3 });
    return `<h${level} id="${id}"${attrs || ''}>${inner}</h${level}>`;
  });

  html = restore(html, bag);

  const words = toText(html).split(/\s+/).filter(Boolean).length;

  return { html, headings, wordCount: words };
}

export function plainExcerpt(content: string, maxLen = 155): string {
  const words = toText((content || '').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  let out = '';
  for (const word of words) {
    const candidate = out ? `${out} ${word}` : word;
    if (candidate.length > maxLen) break;
    out = candidate;
  }
  return out;
}

export function relatedPosts(posts: BlogPost[], current: BlogPost, limit = 3): BlogPost[] {
  const currentTags = new Set(current.tags || []);
  return posts
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({
      post,
      shared: (post.tags || []).filter((tag) => currentTags.has(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map((entry) => entry.post);
}
