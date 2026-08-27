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
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 backdrop-blur-md dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-400 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for opportunities
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl xl:text-6xl">
              Hello, I&apos;m{' '}
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
                Mohammad Shihab Hossain
              </span>
            </h1>
            <p className="text-base font-semibold text-primary/90 md:text-lg">
              Problem Solver | Full Stack Developer | Tech Enthusiast
            </p>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base lg:mx-0">
              I build scalable web applications and AI-powered tools with a focus on clean
              architecture, accessibility, and real-world impact.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button asChild className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98]">
              <Link href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
                View My CV
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-white/20 bg-card/60 backdrop-blur-md hover:bg-card/90 hover:border-primary/40 shadow-sm">
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
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-card/60 text-foreground shadow-md backdrop-blur-md transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-card/90 hover:text-primary hover:shadow-lg hover:shadow-primary/20"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* FLOATING PICTURE CONTAINER */}
        <div className="relative z-10 mx-auto flex w-full max-w-[18rem] items-center justify-center py-6 md:max-w-[20rem] xl:max-w-[24rem]">
          <div className="relative h-56 w-56 md:h-64 md:w-64 xl:h-72 xl:w-72 animate-float">
            {/* Glowing Backdrop Mesh */}
            <div className="pointer-events-none absolute -inset-4 -z-20 rounded-full bg-gradient-to-tr from-violet-600/40 via-fuchsia-500/30 to-cyan-400/40 blur-2xl animate-glow-pulse" />
            <div className="pointer-events-none absolute -inset-2 -z-10 rounded-full border-2 border-primary/40 dark:border-primary/50 shadow-[0_0_35px_rgba(168,85,247,0.35)]" />
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-full border border-cyan-400/25 dark:border-cyan-400/35" />

            {/* Profile Image Circle */}
            <div 
              itemScope 
              itemType="https://schema.org/Person" 
              className="relative z-10 h-full w-full overflow-hidden rounded-full border-4 border-background/80 shadow-[0_0_35px_rgba(168,85,247,0.3)] backdrop-blur-md"
            >
              <Image
                src="/mypic.jpeg"
                alt="Mohammad Shihab Hossain"
                fill
                itemProp="image"
                className="object-cover object-top transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>

            {/* Floating Glass Badge */}
            <div className="absolute -bottom-2 -right-2 z-20 flex items-center gap-1.5 rounded-2xl border border-emerald-500/40 bg-slate-900/80 px-3.5 py-2 text-xs font-bold text-emerald-400 shadow-xl backdrop-blur-xl animate-float-reverse">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Open to Work
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
          {statsData.map((stat) => {
            const Icon = statIcons[stat.icon] || Code2;
            return (
              <div
                key={stat.id}
                className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-card/50 p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/75 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 text-primary border border-primary/20">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-extrabold leading-none text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
