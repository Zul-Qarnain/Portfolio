'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { isExcludedPath } from '@/lib/visits';

const DUPLICATE_WINDOW_MS = 1_500;

const lastReportedAt = new Map<string, number>();

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || isExcludedPath(pathname)) return;

    const now = Date.now();
    const previous = lastReportedAt.get(pathname);

    // StrictMode runs the mount effect twice in dev; drop the echo.
    if (previous !== undefined && now - previous < DUPLICATE_WINDOW_MS) return;

    lastReportedAt.set(pathname, now);

    void fetch('/api/visit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {
      // Tracking must never surface as a user-facing error.
    });
  }, [pathname]);

  return null;
}
