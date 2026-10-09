import type { Metadata } from 'next';

/**
 * Applies to the whole /adminpacha segment. The login page is served at
 * /adminpacha with no trailing slash, which `Disallow: /adminpacha/` in
 * robots.txt does not match, so this is what actually keeps it out of index.
 */
export const metadata: Metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
