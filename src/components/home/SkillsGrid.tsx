import Link from 'next/link';
import { featuredSkills } from '@/lib/data';
import { SectionHeader } from '@/components/home/SectionHeader';
import { SkillBrandIcon } from '@/components/home/SkillBrandIcon';

export function SkillsGrid({ showHeader = true }: { showHeader?: boolean }) {
  const inner = (
    <>
      {showHeader && <SectionHeader title="Skills" href="/skills" linkLabel="View All Skills" />}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {featuredSkills.map((skill) => (
          <Link
            key={skill.slug}
            href="/skills"
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-4 py-8 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            <SkillBrandIcon slug={skill.slug} />
            <span className="text-sm font-semibold text-foreground group-hover:text-primary">
              {skill.name}
            </span>
          </Link>
        ))}
      </div>
    </>
  );

  if (!showHeader) {
    return inner;
  }

  return (
    <section id="skills" className="section-container">
      {inner}
    </section>
  );
}
