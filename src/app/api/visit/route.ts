import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase-config';
import { isExcludedPath, resolveClientIp, sanitizeVisitPath } from '@/lib/visits';

export const dynamic = 'force-dynamic';

const DUPLICATE_WINDOW_MS = 60_000;
const MAX_TRACKED_KEYS = 2_000;

const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());

// Best-effort per-instance guard: absorbs refresh storms and double beacons.
const recent = new Map<string, number>();

function isDuplicate(key: string): boolean {
  const now = Date.now();
  const last = recent.get(key);

  if (last !== undefined && now - last < DUPLICATE_WINDOW_MS) return true;

  if (recent.size >= MAX_TRACKED_KEYS) {
    const oldest = recent.keys().next().value;
    if (oldest !== undefined) recent.delete(oldest);
  }

  recent.set(key, now);
  return false;
}

export async function POST(request: Request) {
  let path = '/';

  try {
    const body = (await request.json()) as { path?: unknown } | null;
    path = sanitizeVisitPath(body?.path);
  } catch {
    // A bodyless beacon still counts as a homepage hit.
  }

  if (isExcludedPath(path)) {
    return NextResponse.json({ recorded: false });
  }

  const ip = resolveClientIp(request.headers);

  if (isDuplicate(`${ip}|${path}`)) {
    return NextResponse.json({ recorded: false });
  }

  const { error } = await supabase.rpc('record_site_visit', { p_ip: ip, p_path: path });

  if (error) {
    console.error('[visit] record_site_visit failed:', error.message);
  }

  return NextResponse.json({ recorded: !error });
}
