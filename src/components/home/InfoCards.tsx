import { GraduationCap, MapPin, Briefcase, Mail } from 'lucide-react';
import { contactEmail, educationData, experienceData, locationData } from '@/lib/data';

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
  return (
    <section id="about" className="section-container !py-8 md:!py-10">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const content = (
            <div className="flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="mb-1 text-sm font-semibold text-foreground">{card.title}</h3>
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
