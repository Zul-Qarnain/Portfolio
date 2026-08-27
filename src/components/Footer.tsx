import type { ElementType } from 'react';
import { Github, Linkedin, Twitter, Mail, ExternalLink, GraduationCap, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import { profileLinks } from '@/lib/data';
import { HuggingFaceIcon, KaggleIcon } from '@/components/SocialIcons';

export function Footer() {
  const iconComponents: { [key: string]: ElementType } = {
    Github, Linkedin, Twitter, Mail, GraduationCap, FlaskConical, Kaggle: KaggleIcon, HuggingFace: HuggingFaceIcon
  };

  return (
    <footer className="border-t border-white/10 bg-background/60 backdrop-blur-xl py-8 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Mohammad Shihab Hossain. All rights reserved.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          {profileLinks.map((link) => {
            const Icon = iconComponents[link.icon] || ExternalLink;
            return (
              <Link 
                key={link.name} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-card/40 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-card/70 transition-all"
                aria-label={link.ariaLabel}
              >
                <Icon className="w-4 h-4" />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
