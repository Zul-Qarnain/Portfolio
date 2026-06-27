import { PublicationItem } from '@/components/publications/PublicationItem';
import { publicationsData } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publications',
  description: 'Explore a curated list of my published research and conference papers.',
  alternates: {
    canonical: '/publications',
  },
};

export default function PublicationsPage() {
  return (
    <section id="publications" className="section-container">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline text-foreground sm:text-5xl">
          My <span className="text-primary">Publications</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          A collection of my contributions to the academic world, including journal articles and conference papers.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
        {publicationsData.map((pub) => (
          <PublicationItem key={pub.id} publication={pub} />
        ))}
      </div>
      {publicationsData.length === 0 && (
         <p className="text-center text-muted-foreground mt-12">No publications to display at the moment.</p>
      )}
    </section>
  );
}
