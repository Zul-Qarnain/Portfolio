import type { Metadata } from 'next';
import { AchievementsSection } from '@/components/home/AchievementsSection';
import { eventsData } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Events',
  description: "Event highlights and achievements from Mohammad Shihab Hossain's journey.",
  alternates: {
    canonical: '/achievements?category=event',
  },
};

export default function EventsPage() {
  return <AchievementsSection events={eventsData} filter="event" variant="full" />;
}
