import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { projectsData } from '@/lib/data';
import { SectionHeader } from '@/components/home/SectionHeader';
import { Badge } from '@/components/ui/badge';

export function FeaturedProjects() {
  return (
    <section id="projects" className="section-container">
      <SectionHeader title="Featured Projects" href="/projects" linkLabel="View All Projects" />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {projectsData.map((project) => (
          <article
            key={project.id}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-card/50 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:bg-card/75 hover:shadow-2xl hover:shadow-primary/15"
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
                    className="rounded-full border border-white/10 bg-primary/10 backdrop-blur-md px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/20"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              <Link
                href={project.liveUrl || project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
              >
                Live Demo
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
