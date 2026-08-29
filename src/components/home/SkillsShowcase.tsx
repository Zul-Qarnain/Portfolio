'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Code2, Brain, LineChart, Layers, Database, Wrench } from 'lucide-react';
import { skillCategoryOrder, skillsData, type Skill } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/theme-provider';

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

function SkillChip({ skill, isRetro }: { skill: Skill; isRetro: boolean }) {
  const chipClass = cn(
    'inline-flex items-center rounded-full border border-white/10 bg-background/60 backdrop-blur-md px-3.5 py-1.5 text-[13px] font-medium tracking-tight text-foreground/90 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/15 hover:text-primary hover:shadow-md hover:shadow-primary/10',
    isRetro && 'border-purple-500/30 bg-purple-500/10 text-purple-200 font-mono text-xs hover:border-purple-400 hover:text-purple-100 hover:shadow-[0_0_12px_rgba(168,85,247,0.4)]'
  );

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
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRetro = mounted && theme === 'anime-retro';

  const grouped = skillCategoryOrder.map((category) => ({
    category,
    skills: skillsData.filter((skill) => skill.category === category),
    ...categoryMeta[category],
  }));

  return (
    <section id="skills" className="section-container scroll-mt-20">
      <div className="mb-10 max-w-2xl">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-primary/80">
          Stack
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Skills &{' '}
          <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
            Technologies
          </span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          {isRetro
            ? 'Here are some technologies I work with and have experience in.'
            : 'Libraries stay with libraries. Concepts stay with concepts. A clean map of the tools I actually use.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {grouped.map(({ category, skills, icon: Icon, span }) => (
          <article
            key={category}
            className={cn(
              'group relative overflow-hidden rounded-3xl border p-6 shadow-lg backdrop-blur-xl transition-all duration-300',
              isRetro
                ? 'border-purple-500/40 bg-[#0e0720]/90 shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.45)]'
                : 'border-white/10 bg-card/50 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/75 hover:shadow-xl hover:shadow-primary/10',
              span
            )}
          >
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="mb-5 flex items-center gap-3">
              <span className={`flex h-9 w-9 items-center justify-center rounded-2xl border ${
                isRetro
                  ? 'border-purple-400/50 bg-purple-500/20 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'border-white/10 bg-primary/10 text-primary'
              }`}>
                <Icon className="h-4 w-4" />
              </span>
              <h3 className={`text-sm font-bold tracking-tight md:text-[15px] ${isRetro ? 'font-mono text-purple-200' : 'text-foreground'}`}>
                {category} {isRetro ? '~' : ''}
              </h3>
            </div>
            <ul className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li key={`${category}-${skill.name}`}>
                  <SkillChip skill={skill} isRetro={isRetro} />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
