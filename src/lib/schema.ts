import { siteUrl } from '@/lib/seo';

/**
 * JSON.stringify does not escape `<`, so a post title containing "</script>"
 * would break out of the inline script tag once rendered via innerHTML.
 */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
const PERSON_ID = '/#person';
const SITE_ID = '/#website';

const profile = {
  name: 'Mohammad Shihab Hossain',
  jobTitle: 'Computer Science Student & Software Developer',
  alumniOf: 'American International University-Bangladesh',
  worksFor: {
    '@type': 'Organization',
    name: 'American International University-Bangladesh',
  },
  alternateName: [
    'Md. Shihab Hossain',
    'Shihab Hossain',
    'Mohammad Shihab',
    'Md Shihab Hossain',
    'Md Shihab',
    'Shihab',
    'shihab.dev',
  ],
  sameAs: [
    'https://github.com/Zul-Qarnain',
    'https://www.linkedin.com/in/zul-qarnain20/',
    'https://orcid.org/0009-0007-0212-6562',
    'https://www.researchgate.net/profile/Mohammad-Hossian-2',
    'https://aiub.academia.edu/MohammadShihabHossian',
    'https://scholar.google.com/citations?user=RebPXvAAAAAJ',
    'https://www.semanticscholar.org/author/Mohammad-Shihab-Hossain/2354509770',
    'https://stackoverflow.com/users/14467410/mohammod-shihab-hossain',
    'https://sciprofiles.com/profile/mdshihab',
    'https://loop.frontiersin.org/people/3299583/overview',
    'https://dev.to/zulqarnain_15',
    'https://medium.com/@mdshihab.dev',
    'https://www.kaggle.com/shihabdev20',
    'https://huggingface.co/Zulqarnain',
    'https://www.credly.com/users/shihab',
    'https://gitlab.com/Zul-Qarnain02',
    'https://gravatar.com/zulqarnain20',
    'https://linktr.ee/shihab.dev',
    'https://about.me/mdshihab.dev',
    'https://index.ieomsociety.org/index.cfm/author/view/ID/3B8DAFF4-CD92-2CE9-624E9D4FBE3B654C',
  ],
};

export function profilePageSchema() {
  const base = siteUrl();
  const image = {
    '@type': 'ImageObject',
    '@id': `${base}#primaryimage`,
    url: `${base}/mypic-square.jpeg`,
    contentUrl: `${base}/mypic-square.jpeg`,
    caption: profile.name,
    width: 1023,
    height: 1023,
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${base}#profilepage`,
        url: `${base}/`,
        name: `${profile.name} - Personal Portfolio`,
        primaryImageOfPage: image,
        mainEntity: {
          '@type': 'Person',
          '@id': `${base}${PERSON_ID}`,
          ...profile,
          url: base,
          image,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${base}${SITE_ID}`,
        url: base,
        name: profile.name,
        publisher: { '@id': `${base}${PERSON_ID}` },
      },
    ],
  };
}

export interface ArticleSchemaInput {
  title: string;
  slug: string;
  description?: string;
  content: string;
  publishedAt?: string | null;
  updatedAt?: string | null;
  tags?: string[] | null;
  featuredImageUrl?: string | null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Every field here is derived from content that is rendered on the page, so the
 * markup cannot contradict the visible article.
 */
export function blogPostingSchema(input: ArticleSchemaInput) {
  const base = siteUrl();
  const url = `${base}/posts/${input.slug}`;
  const text = stripHtml(input.content);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: input.title,
    url,
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      '@id': `${base}${PERSON_ID}`,
      name: profile.name,
      url: base,
    },
    publisher: {
      '@type': 'Person',
      '@id': `${base}${PERSON_ID}`,
      name: profile.name,
      url: base,
    },
    wordCount: text ? text.split(' ').filter(Boolean).length : 0,
  };

  if (input.description) schema.description = input.description;
  if (input.publishedAt) schema.datePublished = new Date(input.publishedAt).toISOString();
  if (input.updatedAt) schema.dateModified = new Date(input.updatedAt).toISOString();
  if (input.featuredImageUrl) {
    schema.image = input.featuredImageUrl;
  } else {
    schema.image = `${base}/mypic-square.jpeg`;
  }
  if (input.tags?.length) {
    schema.keywords = input.tags.join(', ');
    schema.articleSection = input.tags;
  }

  return schema;
}

export function breadcrumbSchema(
  trail: { name: string; path: string }[],
) {
  const base = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}
