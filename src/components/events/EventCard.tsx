
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Event } from '@/lib/data';
import { CalendarDays, MapPin, ArrowRight, Sparkles } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const primaryImage = event.images && event.images.length > 0 ? event.images[0] : 'https://placehold.co/600x400.png';

  return (
    <Dialog>
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-indigo-500/[0.03] to-card p-0 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/60 hover:shadow-[0_12px_30px_-15px_rgba(99,102,241,0.35)] group">
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
          <Image
            src={primaryImage}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-background/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300 backdrop-blur-md shadow-sm">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              Event
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="mb-2 text-lg font-bold leading-snug text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {event.title}
          </h3>
          
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 text-indigo-700 dark:text-indigo-300 font-medium">
              <CalendarDays className="h-3.5 w-3.5" />
              {event.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {event.location}
            </span>
          </div>
          
          <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {event.description}
          </p>
          
          <DialogTrigger asChild>
            <Button variant="default" className="mt-auto w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold transition-all group-hover:shadow-indigo-500/25">
              Read details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
        </div>
      </article>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col rounded-2xl p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
          <DialogDescription asChild>
            <span className="flex flex-wrap items-center text-xs text-muted-foreground mt-1 mb-1 gap-x-2">
                <span className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium"><CalendarDays className="h-3.5 w-3.5 mr-1.5" /> {event.date}</span>
                <span className="hidden sm:inline">|</span>
                <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1.5" /> {event.location}</span>
            </span>
          </DialogDescription>
        </DialogHeader>

        {event.images && event.images.length > 0 && (
          <div className="my-4 flex-shrink-0 min-h-[100px]">
            {event.images.length === 1 ? (
              <div className="relative w-full h-64 rounded-xl overflow-hidden border border-border">
                <Image 
                  src={event.images[0]} 
                  alt={event.title} 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                {event.images.map((imgSrc, index) => (
                  <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-border">
                    <Image 
                      src={imgSrc} 
                      alt={`${event.title} - image ${index + 1}`} 
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <ScrollArea className="flex-grow pr-2 -mr-4 min-h-[100px]">
          <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
            {event.story}
          </p>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

