'use client';

import { useEffect, useState, type ElementType } from 'react';
import { Github, Linkedin, Twitter, Mail, ExternalLink, GraduationCap, FlaskConical, Heart, Coffee } from 'lucide-react';
import Link from 'next/link';
import { profileLinks } from '@/lib/data';
import { HuggingFaceIcon, KaggleIcon } from '@/components/SocialIcons';
import { useTheme } from '@/components/providers/theme-provider';

export function Footer() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRetro = mounted && theme === 'anime-retro';

  const iconComponents: { [key: string]: ElementType } = {
    Github, Linkedin, Twitter, Mail, GraduationCap, FlaskConical, Kaggle: KaggleIcon, HuggingFace: HuggingFaceIcon
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-background/60 backdrop-blur-xl py-8 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        <div>
          <p className={`text-sm text-muted-foreground ${isRetro ? 'font-mono text-purple-300' : ''}`}>
            {isRetro ? (
              <span className="flex items-center gap-1.5">
                © {new Date().getFullYear()} shihab.dev • Built with <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500 inline" /> & <Coffee className="h-3.5 w-3.5 text-amber-400 inline" />
              </span>
            ) : (
              `© ${new Date().getFullYear()} Mohammad Shihab Hossain. All rights reserved.`
            )}
          </p>
          {isRetro && (
            <p className="text-xs font-mono text-emerald-400 mt-1 tracking-wider">
              Keep coding, keep growing.
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          {profileLinks.map((link) => {
            const Icon = iconComponents[link.icon] || ExternalLink;
            return (
              <Link 
                key={link.name} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-card/40 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-card/70 transition-all ${
                  isRetro ? 'hover:border-purple-400 hover:text-purple-300 hover:shadow-[0_0_12px_rgba(168,85,247,0.5)]' : ''
                }`}
                aria-label={link.ariaLabel}
              >
                <Icon className="w-4 h-4" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* RETRO TORII SILHOUETTE OVERLAY (MATCHING ANIME.PNG) */}
      {isRetro && (
        <div className="pointer-events-none absolute bottom-0 right-6 opacity-30 z-0 hidden sm:block">
          <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 50H110V56H10V50Z" fill="#a855f7" />
            <path d="M25 18H95V24H25V18Z" fill="#a855f7" />
            <path d="M15 8H105V14H15V8Z" fill="#c084fc" />
            <rect x="35" y="24" width="8" height="26" fill="#a855f7" />
            <rect x="77" y="24" width="8" height="26" fill="#a855f7" />
            <rect x="56" y="14" width="8" height="10" fill="#c084fc" />
          </svg>
        </div>
      )}
    </footer>
  );
}
