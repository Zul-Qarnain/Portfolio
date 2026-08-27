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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl shadow-lg shadow-violet-500/5 transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 group">
          <span className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-primary/40 ring-offset-2 ring-offset-background transition-transform group-hover:scale-105">
            <Image
              src="/mypic-square.jpeg"
              alt="Mohammad Shihab Hossain"
              fill
              className="object-cover object-top"
              sizes="36px"
            />
          </span>
          <span className="text-sm font-bold tracking-tight text-foreground sm:text-base group-hover:text-primary transition-colors">
            Shihab Hossain
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              className={cn(
                'relative text-sm font-medium transition-all hover:text-primary hover:-translate-y-0.5',
                isActive(item.href, pathname || '') ? 'text-primary font-semibold' : 'text-muted-foreground'
              )}
            >
              {item.label}
              {isActive(item.href, pathname || '') && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden border border-white/10 bg-card/40 backdrop-blur-md"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-background/90 backdrop-blur-2xl px-4 py-4 xl:hidden shadow-2xl animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(event) => handleNavClick(event, item.href)}
                className={cn(
                  'rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all text-center border border-transparent',
                  isActive(item.href, pathname || '')
                    ? 'border-primary/30 bg-primary/15 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-card/60 hover:text-foreground hover:border-white/10'
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
