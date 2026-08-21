import type { Metadata } from 'next';
import { AchievementsSection } from '@/components/home/AchievementsSection';
import { eventsData } from '@/lib/data';
import { parseAchievementFilter, parseAchievementYear } from '@/lib/achievements';

export const metadata: Metadata = {
  title: 'Achievements',
  description:
    "Awards, certifications, competitions, conference recognition, and event highlights from Mohammad Shihab Hossain's journey.",
  alternates: {
    canonical: '/achievements',
  },
};

export default async function AchievementsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; year?: string }>;
}) {
  const params = await searchParams;

  return (
    <AchievementsSection
      events={eventsData}
      filter={parseAchievementFilter(params.category)}
      year={parseAchievementYear(params.year)}
      variant="full"
    />
  );
}
