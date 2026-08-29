'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  GraduationCap,
  Medal,
  Presentation,
  ScrollText,
  Trophy,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Calendar,
  Building2,
  CheckCircle2,
  FilterX,
} from 'lucide-react';
import {
  achievementFilters,
  achievementYear,
  achievementsData,
  buildAchievementsPath,
  extractYear,
  type Achievement,
  type AchievementFilterId,
} from '@/lib/achievements';
import { EventCard } from '@/components/events/EventCard';
import { cn } from '@/lib/utils';

type TimelineEvent = {
  id: string;
  title: string;
  images: string[];
  imageHint: string;
  date: string;
  location: string;
  description: string;
  story: string;
};

const icons = {
  award: Award,
  certificate: ScrollText,
  trophy: Trophy,
  presentation: Presentation,
  academic: GraduationCap,
};

const categoryHeadings: Record<Exclude<AchievementFilterId, 'all'>, string> = {
  academic: 'Academic Excellence & Dean’s List',
  certification: 'Technical Certifications',
  competition: 'Competitions & Project Awards',
  conference: 'Conference Recognition & Presentations',
  event: 'Events & Highlights',
};

const cardThemes: Record<
  Achievement['category'],
  {
    card: string;
    iconBg: string;
    label: string;
    chip: string;
    accent: string;
    button: string;
  }
> = {
  academic: {
    card: 'border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-amber-500/[0.04] to-card shadow-[0_4px_24px_-10px_rgba(245,158,11,0.3)] hover:border-amber-500/70 hover:shadow-[0_12px_32px_-10px_rgba(245,158,11,0.45)]',
    iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/25',
    label: 'text-amber-700 dark:text-amber-300',
    chip: 'bg-amber-500/15 text-amber-800 dark:text-amber-200 border border-amber-500/30 font-semibold',
    accent: 'text-amber-600 dark:text-amber-400',
    button: 'border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 hover:border-amber-500/60',
  },
  certification: {
    card: 'border-sky-500/40 bg-gradient-to-br from-sky-500/15 via-sky-500/[0.04] to-card shadow-[0_4px_24px_-10px_rgba(14,165,233,0.3)] hover:border-sky-500/70 hover:shadow-[0_12px_32px_-10px_rgba(14,165,233,0.45)]',
    iconBg: 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-md shadow-sky-500/25',
    label: 'text-sky-700 dark:text-sky-300',
    chip: 'bg-sky-500/15 text-sky-800 dark:text-sky-200 border border-sky-500/30 font-semibold',
    accent: 'text-sky-600 dark:text-sky-400',
    button: 'border-sky-500/40 bg-sky-500/10 text-sky-800 dark:text-sky-200 hover:bg-sky-500/20 hover:border-sky-500/60',
  },
  competition: {
    card: 'border-emerald-500/40 bg-gradient-to-br from-emerald-500/15 via-emerald-500/[0.04] to-card shadow-[0_4px_24px_-10px_rgba(16,185,129,0.3)] hover:border-emerald-500/70 hover:shadow-[0_12px_32px_-10px_rgba(16,185,129,0.45)]',
    iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-md shadow-emerald-500/25',
    label: 'text-emerald-700 dark:text-emerald-300',
    chip: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30 font-semibold',
    accent: 'text-emerald-600 dark:text-emerald-400',
    button: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-500/20 hover:border-emerald-500/60',
  },
  conference: {
    card: 'border-violet-500/40 bg-gradient-to-br from-violet-500/15 via-violet-500/[0.04] to-card shadow-[0_4px_24px_-10px_rgba(139,92,246,0.3)] hover:border-violet-500/70 hover:shadow-[0_12px_32px_-10px_rgba(139,92,246,0.45)]',
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/25',
    label: 'text-violet-700 dark:text-violet-300',
    chip: 'bg-violet-500/15 text-violet-800 dark:text-violet-200 border border-violet-500/30 font-semibold',
    accent: 'text-violet-600 dark:text-violet-400',
    button: 'border-violet-500/40 bg-violet-500/10 text-violet-800 dark:text-violet-200 hover:bg-violet-500/20 hover:border-violet-500/60',
  },
};

function AchievementCard({ item, featured = false }: { item: Achievement; featured?: boolean }) {
  const Icon = icons[item.icon] || Medal;
  const theme = cardThemes[item.category];

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col justify-between rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1.5',
        theme.card,
        featured && 'ring-2 ring-amber-400/50 dark:ring-amber-500/40'
      )}
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110', theme.iconBg)}>
            <Icon className="h-6 w-6" />
          </div>
          <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm', theme.chip)}>
            {featured && <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />}
            {featured ? 'Academic Excellence' : item.category}
          </span>
        </div>

        <h3 className="mb-2 text-base font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Building2 className="h-3.5 w-3.5 shrink-0 opacity-70" />
          <span className={cn('line-clamp-1', theme.accent)}>{item.organization}</span>
        </div>

        <div className="mb-4 space-y-1 text-xs text-muted-foreground">
          {item.issued && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0 opacity-60" />
              <span>Issued: <strong className="font-medium text-foreground">{item.issued}</strong></span>
            </div>
          )}
          {item.expires && (
            <p className="text-[11px] text-muted-foreground">Expires: {item.expires}</p>
          )}
          {item.credentialId && (
            <div className="mt-1 inline-block rounded-md bg-muted/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground border border-border/50">
              ID: {item.credentialId}
            </div>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-border/40">
        <Link
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex w-full items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all shadow-sm',
            theme.button
          )}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Verify Credential
          <ExternalLink className="h-3.5 w-3.5 ml-0.5 opacity-70" />
        </Link>
      </div>
    </article>
  );
}

function AchievementGroups({
  filter,
  visibleAchievements,
  visibleEvents,
}: {
  filter: AchievementFilterId;
  visibleAchievements: Achievement[];
  visibleEvents: TimelineEvent[];
}) {
  const grouped = {
    academic: visibleAchievements.filter((item) => item.category === 'academic'),
    certification: visibleAchievements.filter((item) => item.category === 'certification'),
    competition: visibleAchievements.filter((item) => item.category === 'competition'),
    conference: visibleAchievements.filter((item) => item.category === 'conference'),
  };

  const headings =
    filter === 'all'
      ? (['academic', 'certification', 'competition', 'conference', 'event'] as const)
      : ([filter] as const);

  const totalCount = visibleAchievements.length + visibleEvents.length;

  return (
    <div className="space-y-10">
      {totalCount === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <FilterX className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
          <p className="text-sm font-medium text-muted-foreground">
            No awards, certifications, or events match this filter.
          </p>
        </div>
      )}

      {headings.map((category) => {
        if (category === 'event') {
          if (visibleEvents.length === 0) return null;
          return (
            <div key="event" className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                {categoryHeadings.event}
                <span className="ml-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-600 dark:text-indigo-400">
                  {visibleEvents.length}
                </span>
              </h3>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleEvents.map((item) => (
                  <EventCard key={item.id} event={item} />
                ))}
              </div>
            </div>
          );
        }

        const items = grouped[category];
        if (items.length === 0) return null;
        const featured = items.filter((item) => item.featured);
        const rest = items.filter((item) => !item.featured);

        return (
          <div key={category} className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {categoryHeadings[category]}
              <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {items.length}
              </span>
            </h3>
            {featured.length > 0 && (
              <div className="mb-4 grid gap-5 md:grid-cols-2">
                {featured.map((item) => (
                  <AchievementCard key={item.id} item={item} featured />
                ))}
              </div>
            )}
            {rest.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {rest.map((item) => (
                  <AchievementCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AchievementsSection({
  events,
  filter: initialFilter = 'all',
  year: initialYear = 'All Years',
  variant = 'full',
}: {
  events: TimelineEvent[];
  filter?: AchievementFilterId;
  year?: string;
  variant?: 'preview' | 'full';
}) {
  const [activeFilter, setActiveFilter] = useState<AchievementFilterId>(initialFilter);
  const [activeYear, setActiveYear] = useState<string>(initialYear);

  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  useEffect(() => {
    setActiveYear(initialYear);
  }, [initialYear]);

  const years = [
    'All Years',
    ...Array.from(
      new Set(
        [
          ...achievementsData.map((item) => achievementYear(item)),
          ...events.map((item) => extractYear(item.date)),
        ].filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => Number(b) - Number(a)),
  ];

  const handleFilterChange = (newFilter: AchievementFilterId) => {
    setActiveFilter(newFilter);
    if (variant === 'full' && typeof window !== 'undefined') {
      const newPath = buildAchievementsPath(newFilter, activeYear);
      window.history.replaceState(null, '', newPath);
    }
  };

  const handleYearChange = (newYear: string) => {
    setActiveYear(newYear);
    if (variant === 'full' && typeof window !== 'undefined') {
      const newPath = buildAchievementsPath(activeFilter, newYear);
      window.history.replaceState(null, '', newPath);
    }
  };

  const visibleAchievements = achievementsData.filter((item) => {
    const categoryOk = activeFilter === 'all' || item.category === activeFilter;
    const itemYear = achievementYear(item);
    return categoryOk && (activeYear === 'All Years' || itemYear === activeYear);
  });

  const visibleEvents =
    activeFilter === 'all' || activeFilter === 'event'
      ? events.filter((item) => activeYear === 'All Years' || extractYear(item.date) === activeYear)
      : [];

  const totalCount = achievementsData.length + events.length;
  const filteredCount = visibleAchievements.length + visibleEvents.length;

  if (variant === 'preview') {
    const previewItems = [
      ...achievementsData.filter((item) => item.featured),
      ...achievementsData.filter((item) => !item.featured).slice(0, 4),
    ];

    return (
      <section id="achievements" className="section-container scroll-mt-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Honors & Recognitions</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Achievements</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              Academic honors, certifications, competition awards, and event highlights.
            </p>
          </div>
          <Link
            href="/achievements"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline shrink-0"
          >
            View all achievements
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {achievementFilters.map((item) => {
            const isSelected = activeFilter === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => handleFilterChange(item.id)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all sm:text-sm shadow-sm',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-muted/50'
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {previewItems
            .filter((item) => activeFilter === 'all' || item.category === activeFilter)
            .map((item) => (
              <AchievementCard key={item.id} item={item} featured={item.featured} />
            ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/achievements"
            className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] font-mono tracking-wide"
          >
            &gt; View All Achievements &lt;
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div id="events" className="scroll-mt-20">
      <section id="achievements" className="section-container scroll-mt-20">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Honors, Awards & Certifications</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">Achievements</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            Filter awards, certifications, competitions, conference recognition, and events by category or year.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="relative z-30 mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-md shadow-sm">
          <div className="flex flex-wrap gap-2 items-center">
            {achievementFilters.map((item) => {
              const selected = activeFilter === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleFilterChange(item.id)}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all sm:text-sm cursor-pointer',
                    selected
                      ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted'
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 self-end lg:self-auto">
            {(activeFilter !== 'all' || activeYear !== 'All Years') && (
              <button
                type="button"
                onClick={() => {
                  handleFilterChange('all');
                  handleYearChange('All Years');
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                <FilterX className="h-3.5 w-3.5" />
                Reset
              </button>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <label htmlFor="achievement-year" className="whitespace-nowrap text-xs font-bold uppercase tracking-wider">
                Year
              </label>
              <select
                id="achievement-year"
                value={activeYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="h-9 min-w-[130px] cursor-pointer rounded-full border border-border bg-background px-3 text-xs font-bold text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring shadow-sm"
              >
                {years.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Count Indicator */}
        <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
          <span>
            Showing <strong className="text-foreground font-bold">{filteredCount}</strong> of{' '}
            <strong className="text-foreground font-bold">{totalCount}</strong> achievements & events
          </span>
        </div>

        <AchievementGroups
          filter={activeFilter}
          visibleAchievements={visibleAchievements}
          visibleEvents={visibleEvents}
        />
      </section>
    </div>
  );
}
