import type { Metadata } from 'next';
import { SkillsShowcase } from '@/components/home/SkillsShowcase';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata({
  title: 'Skills',
  description: 'Technical skills of Mohammad Shihab Hossain, grouped by programming, data science, backend, frontend, databases, and tools.',
  path: '/skills',
});

export default function SkillsPage() {
  return <SkillsShowcase />;
}
