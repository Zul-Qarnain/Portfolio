import type { Metadata } from 'next';
import { AchievementsSection } from '@/components/home/AchievementsSection';
import { eventsData } from '@/lib/data';
import { parseAchievementFilter, parseAchievementYear } from '@/lib/achievements';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata({
  title: 'Achievements',
  description:
    "Awards, certifications, competitions, conference recognition, and event highlights from Mohammad Shihab Hossain's journey.",
  path: '/achievements',
});

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
