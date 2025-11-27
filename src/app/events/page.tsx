
"use client";

import { useState, useMemo } from 'react';
import { EventCard } from '@/components/events/EventCard';
import { eventsData } from '@/lib/data';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Note: Metadata export is for static generation, dynamic title/desc would need different approach
// export const metadata: Metadata = {
//   title: 'Events',
//   description: 'These are the notable events and achievements in my journey that I\'m proud of.',
// };

const getYearFromDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getFullYear())) {
      return date.getFullYear().toString();
    }
  } catch {
    const yearMatch = dateString.match(/\b\d{4}\b/);
    if (yearMatch) return yearMatch[0];
  }
  return "Unknown Year";
};

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All Years');

  const uniqueYears = useMemo(() => {
    const years = new Set<string>();
    eventsData.forEach(event => years.add(getYearFromDate(event.date)));
    return ['All Years', ...Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))];
  }, []);

  const filteredEvents = useMemo(() => {
    return eventsData
      .filter(event => {
        const yearMatches = selectedYear === 'All Years' || getYearFromDate(event.date) === selectedYear;
        const termMatches =
          searchTerm.trim() === '' ||
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase());
        return yearMatches && termMatches;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by most recent first
  }, [searchTerm, selectedYear]);

  return (
    <section id="events" className="section-container">
      <div className="mb-10">
        <h1 className="text-4xl font-bold font-headline text-foreground sm:text-5xl mb-3">
          Events
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          These are the notable events and achievements in my journey that I&apos;m proud of.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search events"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs bg-card border-border focus:ring-primary"
        />
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full sm:w-[180px] bg-card border-border focus:ring-primary">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {uniqueYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredEvents.length === 0 && (
         <p className="text-center text-muted-foreground mt-12">No events match your criteria.</p>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
