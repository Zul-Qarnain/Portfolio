import type { Metadata } from 'next';
import { AchievementsSection } from '@/components/home/AchievementsSection';
import { eventsData } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Events',
  description: "Event highlights and achievements from Mohammad Shihab Hossain's journey.",
  // Filtered duplicate of /achievements: keep it crawlable for users but out
  // of the index so it cannot compete with the canonical achievements page.
  // (A canonical to /achievements?category=event would chain, because that
  // URL itself canonicalises to /achievements.)
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/events',
  },
};

export default function EventsPage() {
  return <AchievementsSection events={eventsData} filter="event" variant="full" />;
}
