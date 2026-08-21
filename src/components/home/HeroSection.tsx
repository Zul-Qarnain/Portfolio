import type { ElementType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Github,
  Linkedin,
  Mail,
  BookOpen,
  Download,
  ArrowRight,
  FolderKanban,
  Briefcase,
  Code2,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { heroSocialLinks, resumeUrl, statsData } from '@/lib/data';
import { HuggingFaceIcon, KaggleIcon } from '@/components/SocialIcons';

const socialIcons: Record<string, ElementType> = {
  Github,
  Linkedin,
  Mail,
  BookOpen,
  Kaggle: KaggleIcon,
  HuggingFace: HuggingFaceIcon,
};

const statIcons: Record<string, ElementType> = {
  FolderKanban,
  Briefcase,
  Code2,
  Trophy,
};

export function HeroSection() {
  return (
    <section className="section-container !pt-8 !pb-12 md:!pt-12 md:!pb-16">
      <div className="grid items-center gap-10 isolate lg:grid-cols-[minmax(0,1.15fr)_minmax(0,20rem)_minmax(0,0.9fr)] lg:gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,22rem)_minmax(0,0.85fr)] xl:gap-8">
        <div className="relative z-10 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for opportunities
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl xl:text-6xl">
              Hello, I&apos;m Mohammad{' '}
              <span className="text-primary">Shihab</span> Hossain
            </h1>
            <p className="text-base font-medium text-muted-foreground md:text-lg">
              Problem Solver | Full Stack Developer | Tech Enthusiast
            </p>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base lg:mx-0">
              I build scalable web applications and AI-powered tools with a focus on clean
              architecture, accessibility, and real-world impact.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button asChild className="rounded-xl bg-primary px-5 text-primary-foreground hover:bg-primary/90">
              <Link href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
                View My CV
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-border bg-background">
              <Link href="/contact">
                Contact Me
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-3 lg:justify-start">
            {heroSocialLinks.map((link) => {
              const Icon = socialIcons[link.icon] || Mail;
              return (
                <Link
                  key={link.name}
                  href={link.url}
                  target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="relative z-0 mx-auto flex w-full max-w-[18rem] items-center justify-center overflow-hidden py-4 md:max-w-[20rem] xl:max-w-[22rem]">
          <div className="relative h-52 w-52 md:h-64 md:w-64 xl:h-72 xl:w-72">
            <div className="pointer-events-none absolute -inset-2 -z-10 rounded-full border border-primary/20 dark:border-primary/30" />
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-full border border-sky-400/15 dark:border-sky-400/25" />
            <div className="pointer-events-none absolute inset-3 -z-20 rounded-full bg-gradient-to-tr from-primary/25 via-sky-400/15 to-transparent blur-xl" />
            <div className="relative z-10 h-full w-full overflow-hidden rounded-full border-4 border-background shadow-[0_0_28px_rgba(124,58,237,0.22)]">
              <Image
                src="/mypic.jpeg"
                alt="Mohammad Shihab Hossain"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            <div className="absolute bottom-2 right-1 z-20 rounded-xl border border-emerald-500/30 bg-card/95 px-3 py-2 text-xs font-semibold text-emerald-600 shadow-lg dark:text-emerald-400">
              Open to Work
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 lg:grid-cols-1">
          {statsData.map((stat) => {
            const Icon = statIcons[stat.icon] || Code2;
            return (
              <div
                key={stat.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-bold leading-none text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
