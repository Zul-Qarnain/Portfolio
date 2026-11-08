import { describe, expect, it } from 'vitest';
import {
  achievementYear,
  buildAchievementsPath,
  extractYear,
  parseAchievementFilter,
  parseAchievementYear,
} from '@/lib/achievements';

describe('extractYear', () => {
  it('takes the last 4-digit year in the string', () => {
    expect(extractYear('Fall 2024–2025')).toBe('2025');
    expect(extractYear('Dean’s Award — Spring 2024-2025')).toBe('2025');
  });

  it('finds a lone year', () => {
    expect(extractYear('Mar 2022')).toBe('2022');
    expect(extractYear('1999 reunion')).toBe('1999');
  });

  it('returns null when there is no year', () => {
    expect(extractYear('Advent of Cyber')).toBeNull();
    expect(extractYear('')).toBeNull();
    expect(extractYear(undefined)).toBeNull();
    expect(extractYear('Season 3 champion')).toBeNull();
  });
});

describe('achievementYear', () => {
  it('prefers the issued date over the title', () => {
    expect(
      achievementYear({ issued: 'Dec 2024', title: 'Conference 2023 retrospective' }),
    ).toBe('2024');
  });

  it('falls back to the title when issued has no year', () => {
    expect(achievementYear({ title: '1st Place Project Display 2022' })).toBe('2022');
  });

  it('returns null when neither has a year', () => {
    expect(achievementYear({ title: 'Certificate of Participation' })).toBeNull();
  });
});

describe('parseAchievementFilter', () => {
  it('accepts every known filter id', () => {
    for (const id of ['all', 'academic', 'certification', 'competition', 'conference', 'event']) {
      expect(parseAchievementFilter(id)).toBe(id);
    }
  });

  it('takes the first value of a repeated query param', () => {
    expect(parseAchievementFilter(['certification', 'academic'])).toBe('certification');
  });

  it('falls back to all for junk', () => {
    expect(parseAchievementFilter('hackerman')).toBe('all');
    expect(parseAchievementFilter(undefined)).toBe('all');
    expect(parseAchievementFilter([])).toBe('all');
  });
});

describe('parseAchievementYear', () => {
  it('keeps an explicit year', () => {
    expect(parseAchievementYear('2024')).toBe('2024');
  });

  it('normalises everything else to All Years', () => {
    expect(parseAchievementYear(undefined)).toBe('All Years');
    expect(parseAchievementYear('All Years')).toBe('All Years');
    expect(parseAchievementYear([])).toBe('All Years');
  });
});

describe('buildAchievementsPath', () => {
  it('returns the bare page for defaults', () => {
    expect(buildAchievementsPath()).toBe('/achievements');
  });

  it('encodes filter and year', () => {
    expect(buildAchievementsPath('certification', '2024')).toBe(
      '/achievements?category=certification&year=2024',
    );
  });

  it('omits default parts', () => {
    expect(buildAchievementsPath('all', '2024')).toBe('/achievements?year=2024');
    expect(buildAchievementsPath('event')).toBe('/achievements?category=event');
  });
});
