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

export const metadata: Metadata = {
  title: 'Mohammad Shihab Hossain',
  description:
    'Explore the professional portfolio of Mohammad Shihab Hossain, an aspiring AI & Software Developer.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Mohammad Shihab Hossain',
            url: 'https://shihab.vercel.app',
            image: 'https://shihab.vercel.app/mypic-square.jpeg',
            sameAs: [
              'https://github.com/Zul-Qarnain',
              'https://www.linkedin.com/in/zul-qarnain20/',
              'https://www.kaggle.com/shihabdev20',
              'https://huggingface.co/Zulqarnain',
            ],
            jobTitle: 'Computer Science Student & Software Developer',
            worksFor: {
              '@type': 'Organization',
              name: 'American International University-Bangladesh',
            },
            description: 'Problem Solver, Full Stack Developer, and Tech Enthusiast.',
            alternateName: [
              'shihab hossain',
              'Md. Shihab Hossain',
              'Shihab hossain',
              'Shihab Hossain',
              'Mohammad Shihab',
              'Md. Shihab',
              'Md Shihab Hossain',
              'Md Shihab',
              'Shihab',
              'shihab.dev',
            ],
          }),
        }}
      />

      <HeroSection />
      <InfoCards />
      <SkillsShowcase />
      <FeaturedProjects />

      <AchievementsSection events={eventsData} variant="preview" />

      <section id="publications" className="section-container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Publications</h2>
          <Link href="/publications" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View All Publications
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {publicationsData.map((pub) => (
            <article
              key={pub.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center"
            >
              <div>
                <h3 className="mb-1 text-lg font-bold">{pub.title}</h3>
                <p className="mb-2 text-sm text-muted-foreground">{pub.authors}</p>
                <p className="mb-3 text-sm text-muted-foreground">
                  {pub.venue} • {pub.date}
                </p>
                <Badge variant="outline">{pub.type}</Badge>
              </div>
              <Button asChild variant="outline" className="shrink-0 rounded-xl">
                <Link href={pub.link} target="_blank" rel="noopener noreferrer">
                  Read Paper <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section-container mb-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 shadow-sm md:p-12">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold">Let&apos;s Connect</h2>
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
