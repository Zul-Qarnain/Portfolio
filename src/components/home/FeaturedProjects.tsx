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
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            <div className="relative h-40 w-full overflow-hidden bg-muted">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-sky-500/20" />
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="mb-2 text-lg font-bold leading-snug text-foreground">{project.title}</h3>
              <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">
                {project.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="rounded-full bg-primary/10 text-xs font-medium text-primary hover:bg-primary/15"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              <Link
                href={project.liveUrl || project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
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
