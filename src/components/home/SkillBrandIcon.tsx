import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const icons: Record<string, ReactNode> = {
  html: (
    <svg viewBox="0 0 32 32" className="h-10 w-10" aria-hidden>
      <path fill="#E44D26" d="M6 28 4 2h24l-2 26-10 3z" />
      <path fill="#F16529" d="M16 29.2 24.1 27 26 4H16z" />
      <path fill="#EBEBEB" d="M16 13H10.5l.3 3.4H16v3.3H9.4L10 9.6H16zm0 11.3-.1.1-4.1-1.1-.3-3.1h3.3v1.7l.1.1 2.3.6V24.3z" />
      <path fill="#FFF" d="M16 13v3.4h5.2l-.5 5.5-4.7 1.3v3.4l8.1-2.2.1-.7 1-11.1.1-.6H16zm0-3.4h9.1l.2-2.4H16z" />
    </svg>
  ),
  css: (
    <svg viewBox="0 0 32 32" className="h-10 w-10" aria-hidden>
      <path fill="#1572B6" d="M6 28 4 2h24l-2 26-10 3z" />
      <path fill="#33A9DC" d="M16 29.2 24.1 27 26 4H16z" />
      <path fill="#EBEBEB" d="M16 13H10.2l.3 3.4H16V13zm0-3.4H9.7L10 6.2H16zM16 24.3l-.1.1-4.1-1.1-.3-3h3.3v1.6l.1.1 2.3.6v1.7z" />
      <path fill="#FFF" d="M16 9.6v3.4h5.4l-.4 3.4H16v3.4h4.9l-.5 5.1-4.4 1.2v3.4l8.1-2.2.6-6.6.1-1.1.8-8.6H16z" />
    </svg>
  ),
  javascript: (
    <svg viewBox="0 0 32 32" className="h-10 w-10" aria-hidden>
      <rect width="32" height="32" rx="6" fill="#F7DF1E" />
      <path d="M14.2 23.6c0 2.6-1.5 3.8-4.2 3.8-2 0-3.5-.9-4.3-2.1l2.2-1.3c.5.8 1.1 1.4 2.1 1.4 1.1 0 1.8-.4 1.8-1.9V14h2.4v9.6zm4.4.2c.8 1.4 2.3 2.4 4.6 2.4 2.5 0 4.1-1.3 4.1-3.3 0-2-1.2-2.9-3.4-3.7l-1.2-.5c-1.1-.4-1.5-.8-1.5-1.5 0-.8.7-1.4 1.9-1.4 1.1 0 1.9.4 2.5 1.4l2.1-1.4c-1-1.6-2.7-2.3-4.6-2.3-2.4 0-4 1.4-4 3.3 0 2.1 1.3 2.9 3.4 3.7l1.2.5c1.3.5 1.8.9 1.8 1.7 0 1-1 1.6-2.4 1.6-1.6 0-2.7-.8-3.4-1.9l-2.1 1.4z" fill="#111" />
    </svg>
  ),
  typescript: (
    <svg viewBox="0 0 32 32" className="h-10 w-10" aria-hidden>
      <rect width="32" height="32" rx="6" fill="#3178C6" />
      <path fill="#fff" d="M18.7 15.4h-4.2V14h11v1.4h-4.2V25h-2.6V15.4zM8.6 15.6h8.2v2h-2.8V25h-2.6v-7.4H8.6z" />
    </svg>
  ),
  react: (
    <svg viewBox="0 0 32 32" className="h-10 w-10" aria-hidden>
      <circle cx="16" cy="16" r="3.2" fill="#61DAFB" />
      <g fill="none" stroke="#61DAFB" strokeWidth="1.6">
        <ellipse cx="16" cy="16" rx="13" ry="5.2" />
        <ellipse cx="16" cy="16" rx="13" ry="5.2" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="13" ry="5.2" transform="rotate(120 16 16)" />
      </g>
    </svg>
  ),
  nodejs: (
    <svg viewBox="0 0 32 32" className="h-10 w-10" aria-hidden>
      <path fill="#83CD29" d="M16 3 4.8 9.4v13.2L16 29l11.2-6.4V9.4z" />
      <path fill="#fff" d="M16.9 17.6c0 2.1-1.3 2.7-3.3 2.7-.9 0-1.9-.2-2.6-.5l.4-1.8c.6.3 1.4.5 2.1.5.9 0 1.3-.3 1.3-1.1v-5.6h2.1v5.8zm2.4-5.8h3.5c2.1 0 3.4 1.1 3.4 3 0 2-1.5 3.1-3.6 3.1h-1.2V22h-2.1v-10.2zm2.1 4.4h1.1c.9 0 1.5-.5 1.5-1.3s-.6-1.3-1.5-1.3h-1.1v2.6z" />
    </svg>
  ),
  python: (
    <svg viewBox="0 0 32 32" className="h-10 w-10" aria-hidden>
      <path fill="#3776AB" d="M15.9 4c-5.3 0-4.9 2.3-4.9 2.3l.1 2.4h5v.7H8.3S4 9 4 15.9c0 6.8 3.8 6.6 3.8 6.6h2.3v-3.2s-.1-3.8 3.8-3.8h6.5s3.7.1 3.7-3.6V6.4S24.7 4 15.9 4zm-2.8 1.7a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
      <path fill="#FFD43B" d="M16.1 28c5.3 0 4.9-2.3 4.9-2.3l-.1-2.4h-5v-.7h7.8S28 23 28 16.1c0-6.8-3.8-6.6-3.8-6.6h-2.3v3.2s.1 3.8-3.8 3.8h-6.5s-3.7-.1-3.7 3.6v5.6S7.3 28 16.1 28zm2.8-1.7a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2z" />
    </svg>
  ),
  sql: (
    <svg viewBox="0 0 32 32" className="h-10 w-10" aria-hidden>
      <ellipse cx="16" cy="8" rx="10" ry="4" fill="#336791" />
      <path fill="#336791" d="M6 8v10c0 2.2 4.5 4 10 4s10-1.8 10-4V8c0 2.2-4.5 4-10 4S6 10.2 6 8z" />
      <path fill="#4479A1" d="M6 15v5c0 2.2 4.5 4 10 4s10-1.8 10-4v-5c0 2.2-4.5 4-10 4S6 17.2 6 15z" />
    </svg>
  ),
};

export function SkillBrandIcon({ slug, className }: { slug: string; className?: string }) {
  return <span className={cn('inline-flex items-center justify-center', className)}>{icons[slug]}</span>;
}
