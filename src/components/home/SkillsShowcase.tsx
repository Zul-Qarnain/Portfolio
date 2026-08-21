import Link from 'next/link';
import { Code2, Brain, LineChart, Layers, Database, Wrench } from 'lucide-react';
import { skillCategoryOrder, skillsData, type Skill } from '@/lib/data';
import { cn } from '@/lib/utils';

const categoryMeta: Record<
  (typeof skillCategoryOrder)[number],
  { icon: typeof Code2; span: string }
> = {
  'Programming Languages': { icon: Code2, span: 'md:col-span-7' },
  'Data Science & ML Libraries': { icon: Brain, span: 'md:col-span-5' },
  'Core Analytical Skills': { icon: LineChart, span: 'md:col-span-4' },
  'Web Frameworks (Frontend & Backend)': { icon: Layers, span: 'md:col-span-8' },
  Databases: { icon: Database, span: 'md:col-span-5' },
  'Tools & Platforms': { icon: Wrench, span: 'md:col-span-7' },
};

function SkillChip({ skill }: { skill: Skill }) {
  const chipClass =
    'inline-flex items-center rounded-full border border-border/80 bg-background/50 px-3 py-1.5 text-[13px] font-medium tracking-tight text-foreground/90 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary';

  if (skill.href) {
    return (
      <Link href={skill.href} target="_blank" rel="noopener noreferrer" className={chipClass}>
        {skill.name}
      </Link>
    );
  }

  return <span className={chipClass}>{skill.name}</span>;
}

export function SkillsShowcase() {
  const grouped = skillCategoryOrder.map((category) => ({
    category,
    skills: skillsData.filter((skill) => skill.category === category),
    ...categoryMeta[category],
  }));

  return (
    <section id="skills" className="section-container scroll-mt-20">
      <div className="mb-10 max-w-2xl">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Stack
        </p>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Skills & <span className="text-primary">Technologies</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          Libraries stay with libraries. Concepts stay with concepts. A clean map of the tools I actually use.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {grouped.map(({ category, skills, icon: Icon, span }) => (
          <article
            key={category}
            className={cn(
              'group relative overflow-hidden rounded-3xl border border-border/70 bg-card/40 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card/70',
              span
            )}
          >
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border/70 bg-background/40 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-semibold tracking-tight text-foreground md:text-[15px]">
                {category}
              </h3>
            </div>
            <ul className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li key={`${category}-${skill.name}`}>
                  <SkillChip skill={skill} />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
