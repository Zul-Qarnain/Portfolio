'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, type MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#publications', label: 'Publications' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/events', label: 'Events' },
  { href: '/posts', label: 'Posts' },
  { href: '/contact', label: 'Contact' },
];

function isActive(href: string, pathname: string) {
  if (href === '/') return pathname === '/';
  if (href.startsWith('/#')) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function scrollToHash(href: string) {
  const id = href.startsWith('/#') ? href.slice(2) : href.replace('#', '');
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.replaceState(null, '', `/#${id}`);
  window.dispatchEvent(new CustomEvent('portfolio:section', { detail: id }));
  return true;
}

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (pathname?.startsWith('/adminpacha')) {
    return null;
  }

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setIsMenuOpen(false);
    if (href.startsWith('/#') && (pathname === '/' || pathname === '')) {
      event.preventDefault();
      scrollToHash(href);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-primary/25 ring-offset-2 ring-offset-background">
            <Image
              src="/mypic-square.jpeg"
              alt="Mohammad Shihab Hossain"
              fill
              className="object-cover object-top"
              sizes="32px"
            />
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
            Shihab Hossain
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              className={cn(
                'relative text-sm font-medium transition-colors hover:text-primary',
                isActive(item.href, pathname || '') ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {item.label}
              {isActive(item.href, pathname || '') && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 xl:hidden">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(event) => handleNavClick(event, item.href)}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium',
                  isActive(item.href, pathname || '')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
