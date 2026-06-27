import { ProjectCard } from '@/components/projects/ProjectCard';
import { projectsData } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Discover a selection of my projects, showcasing my skills in software development and problem-solving.',
  alternates: {
    canonical: '/projects',
  },
};

export default function ProjectsPage() {
  return (
    <section id="projects" className="section-container">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline text-foreground sm:text-5xl">
          Featured <span className="text-primary">Projects</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Here are some of the projects I&apos;ve worked on, demonstrating my passion for technology and innovation.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projectsData.map((project) => (
          <div key={project.id} className="group"> {/* Added group class for hover effects on card image */}
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
      {projectsData.length === 0 && (
         <p className="text-center text-muted-foreground mt-12">No projects to display at the moment.</p>
      )}
    </section>
  );
}
