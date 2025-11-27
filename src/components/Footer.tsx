import { Github, Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { profileLinks } from '@/lib/data';

export function Footer() {
  const iconComponents: { [key: string]: React.ElementType } = {
    Github, Linkedin, Twitter, Mail
  };

  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Mohammad Shihab Hossain. All rights reserved.
        </p>
        
        <div className="flex items-center gap-4">
          {profileLinks.map((link) => {
            const Icon = iconComponents[link.icon] || ExternalLink;
            return (
              <Link 
                key={link.name} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={link.ariaLabel}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
