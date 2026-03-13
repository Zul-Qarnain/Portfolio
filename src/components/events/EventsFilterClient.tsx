"use client";

import { useState, useMemo } from 'react';
import { EventCard } from '@/components/events/EventCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Event } from '@/lib/data';

interface EventsFilterClientProps {
  events: Event[];
}

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
  return 'Unknown Year';
};

export default function EventsFilterClient({ events }: EventsFilterClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All Years');

  const uniqueYears = useMemo(() => {
    const years = new Set<string>();
    events.forEach((event) => years.add(getYearFromDate(event.date)));
    return ['All Years', ...Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const yearMatches =
          selectedYear === 'All Years' || getYearFromDate(event.date) === selectedYear;
        const termMatches =
          searchTerm.trim() === '' ||
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase());
        return yearMatches && termMatches;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, searchTerm, selectedYear]);

  return (
    <>
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
    </>
  );
}
