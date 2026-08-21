'use client';

import type { AchievementFilterId } from '@/lib/achievements';

export function YearFilter({
  years,
  year,
  filter,
}: {
  years: string[];
  year: string;
  filter: AchievementFilterId;
}) {
  return (
    <form action="/achievements" method="get" className="flex items-center gap-2 text-sm text-muted-foreground">
      {filter !== 'all' && <input type="hidden" name="category" value={filter} />}
      <label htmlFor="achievement-year" className="whitespace-nowrap font-medium">
        Year
      </label>
      <select
        id="achievement-year"
        name="year"
        defaultValue={year === 'All Years' ? '' : year}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="h-9 min-w-[140px] cursor-pointer rounded-full border border-border bg-card px-3 text-sm font-semibold text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
      >
        {years.map((value) => (
          <option key={value} value={value === 'All Years' ? '' : value}>
            {value}
          </option>
        ))}
      </select>
    </form>
  );
}
