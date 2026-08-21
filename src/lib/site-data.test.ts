import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';
import { eventsData, skillCategoryOrder, skillsData, statsData } from '@/lib/data';
import {
  achievementFilters,
  achievementsData,
  buildAchievementsPath,
  extractYear,
} from '@/lib/achievements';
import { cleanExternalUrl, isLinkedInRedirect } from '@/lib/urls';

describe('cn helper', () => {
  it('merges class names and tailwind conflicts', () => {
    expect(cn('px-2', 'px-4', 'text-sm')).toBe('px-4 text-sm');
  });
});

describe('homepage data', () => {
  it('groups skills into the requested categories', () => {
    expect([...new Set(skillsData.map((skill) => skill.category))]).toEqual([...skillCategoryOrder]);
  });

  it('does not use proficiency percentages', () => {
    expect(skillsData.every((skill) => !('percentage' in skill))).toBe(true);
  });

  it('does not duplicate skill names across categories', () => {
    const names = skillsData.map((skill) => skill.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('keeps conceptual skills separate from libraries', () => {
    const libraries = skillsData
      .filter((skill) => skill.category === 'Data Science & ML Libraries')
      .map((skill) => skill.name);
    const concepts = skillsData
      .filter((skill) => skill.category === 'Core Analytical Skills')
      .map((skill) => skill.name);

    expect(libraries).toEqual(['PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib']);
    expect(concepts).toEqual(['Statistical Analysis', 'Data Visualization']);
  });

  it('exposes four hero stats with 8+ years experience', () => {
    expect(statsData).toHaveLength(4);
    expect(statsData.find((stat) => stat.id === 'experience')?.value).toBe('8+');
  });
});

describe('external urls', () => {
  it('unwraps LinkedIn safety redirects', () => {
    const wrapped =
      'https://www.linkedin.com/safety/go/?url=https%3A%2F%2Fwww.credly.com%2Fbadges%2Fabc';
    expect(cleanExternalUrl(wrapped)).toBe('https://www.credly.com/badges/abc');
  });

  it('converts Acclaim badge links to Credly without tracking params', () => {
    const acclaim =
      'https://www.youracclaim.com/badges/898a102a-362c-4e94-8699-9cb04cdbc491?source=linked_in_profile';
    expect(cleanExternalUrl(acclaim)).toBe(
      'https://www.credly.com/badges/898a102a-362c-4e94-8699-9cb04cdbc491'
    );
  });
});

describe('achievements', () => {
  it('stores only clean destination urls', () => {
    expect(achievementsData.every((item) => !isLinkedInRedirect(item.url))).toBe(true);
    expect(achievementsData.every((item) => !item.url.includes('linkedin.com/safety'))).toBe(true);
  });

  it('includes both Dean’s Awards as featured academic items', () => {
    const deans = achievementsData.filter((item) => item.featured);
    expect(deans).toHaveLength(2);
    expect(deans.every((item) => item.category === 'academic')).toBe(true);
  });

  it('does not duplicate achievement ids', () => {
    const ids = achievementsData.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes an Events category alongside awards and certifications', () => {
    expect(achievementFilters.map((item) => item.id)).toEqual([
      'all',
      'academic',
      'certification',
      'competition',
      'conference',
      'event',
    ]);
    expect(eventsData.length).toBeGreaterThan(0);
  });

  it('builds achievement filter urls without using hash state', () => {
    expect(buildAchievementsPath('all')).toBe('/achievements');
    expect(buildAchievementsPath('certification')).toBe('/achievements?category=certification');
    expect(buildAchievementsPath('event', '2022')).toBe('/achievements?category=event&year=2022');
  });
});

describe('year extraction', () => {
  it('reads years from certificate dates and event dates', () => {
    expect(extractYear('Sep 2022')).toBe('2022');
    expect(extractYear('December 21, 2024')).toBe('2024');
    expect(extractYear('Fall 2024–2025')).toBe('2025');
  });
});
