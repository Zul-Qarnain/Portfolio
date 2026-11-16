'use client';

import Image from 'next/image';
import { ExternalLink, Github, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Project } from '@/lib/data';

interface ProjectDetailsDialogProps {
  project: Project;
  className?: string;
}

export function ProjectDetailsDialog({ project, className }: ProjectDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-primary transition-all hover:underline ${className ?? ''}`}
        >
          <Info className="h-3.5 w-3.5" />
          View details
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>Project overview</DialogDescription>
        </DialogHeader>
        {project.image && (
          <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-muted">
            <Image src={project.image} alt={project.title} fill className="object-cover" sizes="100vw" />
          </div>
        )}
        <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="rounded-full border border-white/10 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
              >
                {tech}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground hover:underline"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          {project.liveUrl && project.liveUrl !== project.githubLink && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
