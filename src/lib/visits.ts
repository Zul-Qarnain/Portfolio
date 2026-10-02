export const VISIT_RETENTION_DAYS = 30;
export const MAX_PATH_LENGTH = 200;
export const MAX_IP_LENGTH = 64;
export const DEFAULT_RECENT_LIMIT = 20;
export const RECENT_LIMIT_OPTIONS = [20, 30, 50] as const;

// Paths that should never be recorded as a site visit.
const EXCLUDED_PREFIXES = ['/adminpacha', '/api'];

const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;
const IPV6 = /^[0-9a-f:]+$/i;

export interface DailyVisitStat {
  day: string;
  loads: number;
  unique_visitors: number;
}

export interface PathVisitStat {
  path: string;
  loads: number;
  unique_visitors: number;
  last_visited_at: string;
}

export interface RecentVisit {
  ip: string;
  path: string;
  visited_at: string;
}

export interface SiteVisitStats {
  total_page_loads: number;
  loads_today: number;
  unique_visitors_today: number;
  unique_visitors_30d: number;
  daily: DailyVisitStat[];
  by_path: PathVisitStat[];
  recent: RecentVisit[];
}

export const EMPTY_SITE_VISIT_STATS: SiteVisitStats = {
  total_page_loads: 0,
  loads_today: 0,
  unique_visitors_today: 0,
  unique_visitors_30d: 0,
  daily: [],
  by_path: [],
  recent: [],
};

function isPlausibleIp(value: string): boolean {
  if (value.length === 0 || value.length > MAX_IP_LENGTH) return false;
  return IPV4.test(value) || (value.includes(':') && IPV6.test(value));
}

/**
 * Vercel sets x-forwarded-for on the edge, so the first entry is trustworthy;
 * anything unparseable degrades to 'unknown' rather than poisoning the table.
 */
export function resolveClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  const candidate = (forwarded?.split(',')[0] ?? headers.get('x-real-ip') ?? '').trim();
  return isPlausibleIp(candidate) ? candidate : 'unknown';
}

export function isExcludedPath(path: string): boolean {
  return EXCLUDED_PREFIXES.some(prefix => path === prefix || path.startsWith(`${prefix}/`));
}

export function sanitizeVisitPath(raw: unknown): string {
  if (typeof raw !== 'string') return '/';

  const trimmed = raw.trim();
  // Reject absolute and protocol-relative URLs so the column stays path-only.
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return '/';

  const pathOnly = trimmed.split(/[?#]/)[0].slice(0, MAX_PATH_LENGTH);
  return pathOnly.length > 1 ? pathOnly : '/';
}

export function normaliseRecentLimit(raw: unknown): number {
  const value = typeof raw === 'number' ? raw : Number.parseInt(String(raw ?? ''), 10);
  if (!Number.isFinite(value)) return DEFAULT_RECENT_LIMIT;
  return Math.min(Math.max(value, 1), 100);
}

export async function fetchSiteVisitStats(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  recentLimit = DEFAULT_RECENT_LIMIT
): Promise<SiteVisitStats> {
  const { data, error } = await supabase.rpc('get_site_visit_stats', {
    p_recent_limit: normaliseRecentLimit(recentLimit),
  });

  if (error) {
    // PostgREST rejects with a plain object, which logs as {} and fails
    // instanceof checks — rethrow as a real Error carrying the Postgres code.
    const message =
      typeof error?.message === 'string' && error.message
        ? error.message
        : 'Unknown error from get_site_visit_stats';
    const code = typeof error?.code === 'string' ? error.code : '';
    throw new Error(code ? `${message} [${code}]` : message);
  }

  return {
    ...EMPTY_SITE_VISIT_STATS,
    ...(data ?? {}),
    daily: Array.isArray(data?.daily) ? data.daily : [],
    by_path: Array.isArray(data?.by_path) ? data.by_path : [],
    recent: Array.isArray(data?.recent) ? data.recent : [],
  };
}
