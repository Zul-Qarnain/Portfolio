'use client';

import { useEffect, useState } from 'react';
import { GraduationCap, MapPin, Briefcase, Mail } from 'lucide-react';
import { contactEmail, educationData, experienceData, locationData } from '@/lib/data';
import { useTheme } from '@/components/providers/theme-provider';

const cards = [
  {
    icon: GraduationCap,
    title: 'Education',
    lines: [educationData.major, educationData.university],
  },
  {
    icon: MapPin,
    title: 'Location',
    lines: [`${locationData.city}, ${locationData.country}`, locationData.availability],
  },
  {
    icon: Briefcase,
    title: 'Experience',
    lines: ['8+ Years of coding and building solutions'],
  },
  {
    icon: Mail,
    title: 'Email',
    lines: [contactEmail, "Let's connect!"],
    href: `mailto:${contactEmail}`,
  },
];

export function InfoCards() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRetro = mounted && theme === 'anime-retro';

  return (
    <section id="about" className="section-container !py-8 md:!py-10">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const content = (
            <div className={`flex h-full items-start gap-4 rounded-2xl border p-5 shadow-lg backdrop-blur-xl transition-all duration-300 ${
              isRetro
                ? 'border-purple-500/40 bg-[#0e0720]/90 shadow-[0_0_18px_rgba(168,85,247,0.2)] hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.45)]'
                : 'border-white/10 bg-card/50 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/75 hover:shadow-xl hover:shadow-primary/10'
            }`}>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                isRetro
                  ? 'border-purple-400/50 bg-purple-500/20 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'bg-gradient-to-br from-primary/20 to-violet-500/20 text-primary border-primary/20'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="mb-1 text-sm font-bold text-foreground">{card.title}</h3>
                {card.lines.map((line) => (
                  <p key={line} className="text-sm leading-relaxed text-muted-foreground">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          );

          return card.href ? (
            <a key={card.title} href={card.href} className="block h-full">
              {content}
            </a>
          ) : (
            <div key={card.title}>{content}</div>
          );
        })}
      </div>
      <p className="mt-6 max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">
        {experienceData.summary}
      </p>
    </section>
  );
}
