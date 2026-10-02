'use client';

import { usePathname } from 'next/navigation';

const HIDDEN_PREFIXES = ['/adminpacha'];

// The admin portal renders its own fixed sidebar and header, so the public
// navbar/footer would otherwise sit underneath it and get clipped.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (HIDDEN_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return null;
  }

  return <>{children}</>;
}
