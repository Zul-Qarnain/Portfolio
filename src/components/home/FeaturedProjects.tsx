'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Flame } from 'lucide-react';
import { projectsData } from '@/lib/data';
import { SectionHeader } from '@/components/home/SectionHeader';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/providers/theme-provider';

export function FeaturedProjects() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRetro = mounted && theme === 'anime-retro';

  return (
    <section id="projects" className="section-container">
      <SectionHeader title="Featured Projects" href="/projects" linkLabel={isRetro ? 'View all →' : 'View All Projects'} />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {projectsData.map((project) => (
          <article
            key={project.id}
            className={`group flex h-full flex-col overflow-hidden rounded-3xl border shadow-lg backdrop-blur-xl transition-all duration-300 ${
              isRetro
                ? 'border-purple-500/40 bg-[#0e0720]/90 shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]'
                : 'border-white/10 bg-card/50 hover:-translate-y-1.5 hover:border-primary/50 hover:bg-card/75 hover:shadow-2xl hover:shadow-primary/15'
            }`}
          >
            <div className="relative h-44 w-full overflow-hidden bg-muted">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-600/30 to-cyan-500/30" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-60" />

              {/* RETRO ANIME DEMON BADGE (MATCHING ANIME.PNG) */}
              {isRetro && (
                <div className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-xl border border-purple-400/60 bg-purple-950/80 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.6)] backdrop-blur-md">
                  <Flame className="h-4 w-4 text-purple-300" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="mb-2 text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      isRetro
                        ? 'border-purple-500/40 bg-purple-500/20 text-purple-300 font-mono'
                        : 'border-white/10 bg-primary/10 backdrop-blur-md text-primary hover:bg-primary/20'
                    }`}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              <Link
                href={project.liveUrl || project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 text-sm font-bold transition-all ${
                  isRetro
                    ? 'font-mono text-purple-400 hover:text-purple-300 hover:underline drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                    : 'text-primary hover:underline'
                }`}
              >
                {isRetro ? 'View Project →' : 'Live Demo'}
                {!isRetro && <ExternalLink className="h-3.5 w-3.5" />}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
