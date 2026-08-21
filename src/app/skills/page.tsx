import type { Metadata } from 'next';
import { SkillsShowcase } from '@/components/home/SkillsShowcase';

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Technical skills of Mohammad Shihab Hossain, grouped by programming, data science, backend, frontend, databases, and tools.',
  alternates: {
    canonical: '/skills',
  },
};

export default function SkillsPage() {
  return <SkillsShowcase />;
}
