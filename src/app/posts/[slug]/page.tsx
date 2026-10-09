import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Clock, Eye, ArrowLeft } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getPublishedPostBySlug, getPublishedPosts } from '@/lib/posts';
import { absoluteUrl, siteUrl } from '@/lib/seo';
import { breadcrumbSchema, blogPostingSchema, jsonLd } from '@/lib/schema';
import { plainExcerpt, prepareArticle, relatedPosts } from '@/lib/article';
import BlogContent from '@/components/BlogContent';

interface PostProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

async function incrementViewCount(postId: string, currentViews: number) {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase
      .from('blog_posts')
      .update({ views_count: currentViews + 1 })
      .eq('id', postId);
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      robots: { index: false, follow: false },
    };
  }

  const url = `/posts/${slug}`;
  // Fall back to the opening of the article rather than repeating the title,
  // which would make the snippet duplicate the headline.
  const description = post.meta_description?.trim() || plainExcerpt(post.content);
  const image = post.featured_image_url || `${siteUrl()}/mypic-square.jpeg`;

  return {
    title: post.title,
    description,
    keywords: post.tags?.length ? post.tags.join(', ') : post.meta_keywords,
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    // Page-level openGraph replaces the root layout's block outright, so every
    // field has to be restated here.
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: absoluteUrl(url),
      siteName: 'Mohammad Shihab Hossain',
      locale: 'en_US',
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      tags: post.tags?.length ? post.tags : undefined,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [image],
    },
  };
}

const PostPage = async ({ params }: PostProps) => {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [prepared, allPosts] = await Promise.all([
    Promise.resolve(prepareArticle(post.content)),
    getPublishedPosts().catch(() => []),
  ]);

  if (post.id) {
    await incrementViewCount(post.id, post.views_count ?? 0);
  }

  const description = post.meta_description?.trim() || plainExcerpt(post.content);
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Posts', path: '/posts' },
    { name: post.title, path: `/posts/${post.slug}` },
  ];

  const jsonLdBlocks = [
    blogPostingSchema({
      title: post.title,
      slug: post.slug,
      description,
      content: prepared.html,
      publishedAt: post.published_at,
      updatedAt: post.updated_at,
      tags: post.tags,
      featuredImageUrl: post.featured_image_url || undefined,
    }),
    breadcrumbSchema(trail),
  ];

  const related = relatedPosts(allPosts, post, 3);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 font-body md:py-14">
      {jsonLdBlocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(block) }}
        />
      ))}

      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          {trail.map((crumb, i) => (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === trail.length - 1 ? (
                <span aria-current="page" className="line-clamp-1 font-medium text-foreground">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="transition-colors hover:text-primary hover:underline"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <header className="mb-8 border-b border-white/10 pb-8">
        <Link
          href="/posts"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All posts
        </Link>

        {post.tags?.length > 0 && (
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            {post.tags[0]}
          </p>
        )}

        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl">
          {post.title}
        </h1>

        {description && (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {post.published_at && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <time dateTime={post.published_at}>{longDate(post.published_at)}</time>
            </span>
          )}
          {prepared.wordCount > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {Math.max(1, Math.round(prepared.wordCount / 200))} min read
            </span>
          )}
          {(post.views_count ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" aria-hidden="true" />
              {post.views_count} views
            </span>
          )}
        </div>

        {post.updated_at && post.published_at && post.updated_at !== post.published_at && (
          <p className="mt-2 text-xs text-muted-foreground">
            Last updated <time dateTime={post.updated_at}>{longDate(post.updated_at)}</time>
          </p>
        )}
      </header>

      {post.featured_image_url && (
        <figure className="mb-8 overflow-hidden rounded-2xl border border-white/10 shadow-lg">
          <Image
            src={post.featured_image_url}
            alt={post.title}
            width={1200}
            height={630}
            priority
            className="aspect-video w-full object-cover"
          />
        </figure>
      )}

      {prepared.headings.length >= 3 && (
        <nav
          aria-label="Table of contents"
          className="mb-8 rounded-2xl border border-white/10 bg-card/50 p-5 backdrop-blur-md"
        >
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">
            Contents
          </h2>
          <ol className="space-y-1.5 text-sm">
            {prepared.headings.map((heading) => (
              <li
                key={heading.id}
                className={heading.level === 3 ? 'pl-4' : undefined}
              >
                <a
                  href={`#${heading.id}`}
                  className="text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <BlogContent content={prepared.html} />

      {post.tags && post.tags.length > 0 && (
        <footer className="mt-10 border-t border-white/10 pt-6">
          <h2 className="sr-only">Tags</h2>
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href="/posts"
                  className="inline-block rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </footer>
      )}

      <section
        aria-labelledby="share-heading"
        className="mt-8 flex flex-wrap items-center gap-3"
      >
        <h2 id="share-heading" className="text-sm font-semibold text-muted-foreground">
          Share this post
        </h2>
        <div className="flex items-center gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(absoluteUrl(`/posts/${post.slug}`))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/10 bg-card/50 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteUrl(`/posts/${post.slug}`))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/10 bg-card/50 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            LinkedIn
          </a>
        </div>
      </section>

      <section
        aria-labelledby="author-heading"
        className="mt-8 rounded-2xl border border-white/10 bg-card/50 p-6 backdrop-blur-md"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Image
            src="/panjabi.jpeg"
            alt=""
            width={80}
            height={80}
            className="h-20 w-20 shrink-0 rounded-full object-cover"
          />
          <div>
            <h2 id="author-heading" className="mb-1.5 text-lg font-bold text-foreground">
              Written by Mohammad Shihab Hossain
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Computer Science student at American International University-Bangladesh, writing
              about artificial intelligence, cybersecurity and software engineering from the
              perspective of someone still learning them.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-block text-sm font-semibold text-primary transition-colors hover:underline"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-10">
          <h2 id="related-heading" className="mb-4 text-xl font-bold text-foreground">
            Keep reading
          </h2>
          <ul className="space-y-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/posts/${item.slug}`}
                  className="group block rounded-2xl border border-white/10 bg-card/50 p-4 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-card/75"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {item.meta_description?.trim() || plainExcerpt(item.content, 110)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default PostPage;
