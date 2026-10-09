import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/home/HeroSection';
import { InfoCards } from '@/components/home/InfoCards';
import { SkillsShowcase } from '@/components/home/SkillsShowcase';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { AchievementsSection } from '@/components/home/AchievementsSection';
import ContactFormLoader from '@/components/contact/ContactFormLoader';
import { publicationsData, eventsData } from '@/lib/data';
import { getPublishedPosts } from '@/lib/posts';
import { plainExcerpt } from '@/lib/article';
import { jsonLd, profilePageSchema } from '@/lib/schema';
import { Newspaper } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mohammad Shihab Hossain',
  description:
    'Explore the professional portfolio of Mohammad Shihab Hossain, an aspiring AI & Software Developer.',
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  // Rendered on the server so the links exist in the initial HTML that
  // Googlebot reads, without shipping client JS for the section.
  const posts = await getPublishedPosts().catch(() => []);

  return (
    <div className="min-h-screen text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(profilePageSchema()) }}
      />

      <HeroSection />
      <InfoCards />
      <SkillsShowcase />
      <FeaturedProjects />

      {posts.length > 0 && (
        <section id="writing" className="section-container">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              Latest Writing
            </h2>
            <Link
              href="/posts"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:underline"
            >
              All posts
              <ChevronRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {posts.slice(0, 4).map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-card/50 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/75"
                >
                  <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
                    {post.tags?.[0] || 'Article'}
                  </span>
                  <h3 className="font-bold leading-snug text-foreground group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {post.meta_description?.trim() || plainExcerpt(post.content, 140)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AchievementsSection events={eventsData} variant="preview" />

      <section id="publications" className="section-container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Publications</h2>
          <Link href="/publications" className="group inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            View All Publications
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="space-y-4">
          {publicationsData.map((pub) => (
            <article
              key={pub.id}
              className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-card/50 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/75 hover:shadow-xl md:flex-row md:items-center"
            >
              <div>
                <h3 className="mb-1 text-lg font-bold">{pub.title}</h3>
                <p className="mb-2 text-sm text-muted-foreground">{pub.authors}</p>
                <p className="mb-3 text-sm text-muted-foreground">
                  {pub.venue} • {pub.date}
                </p>
                <Badge variant="outline" className="border-white/10 bg-primary/10 text-primary">{pub.type}</Badge>
              </div>
              <Button asChild variant="outline" className="shrink-0 rounded-xl border-white/15 bg-card/60 backdrop-blur-md hover:bg-card/90 hover:border-primary/40">
                <Link href={pub.link} target="_blank" rel="noopener noreferrer">
                  Read Paper <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section-container mb-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-card/50 p-8 shadow-xl backdrop-blur-2xl md:p-12">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-extrabold">Let&apos;s Connect</h2>
            <p className="text-muted-foreground">
              Have a project in mind or just want to say hi? Feel free to reach out.
            </p>
          </div>
          <ContactFormLoader />
        </div>
      </section>
    </div>
  );
}
