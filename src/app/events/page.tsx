import type { Metadata } from 'next';
import { eventsData } from '@/lib/data';
import EventsFilterClient from '@/components/events/EventsFilterClient';

export const metadata: Metadata = {
  title: 'Events',
  description: "Notable events and achievements in Mohammad Shihab Hossain's journey.",
};

export default function EventsPage() {
  return (
    <section id="events" className="section-container">
      <div className="mb-10">
        <h1 className="text-4xl font-bold font-headline text-foreground sm:text-5xl mb-3">
          Events
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          These are the notable events and achievements in my journey that I&apos;m proud of.
        </p>
      </div>

      {/* Client component handles search/filter; static event data is server-rendered for SEO */}
      <EventsFilterClient events={eventsData} />
    </section>
  );
}
