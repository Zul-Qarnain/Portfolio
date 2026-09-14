"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Event } from '@/lib/data';
import { CalendarDays, MapPin, ArrowRight, Sparkles, ExternalLink, Maximize2, X } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const hasImages = Boolean(event.images && event.images.length > 0);
  const primaryImage = hasImages ? event.images[0] : null;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <Dialog>
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-indigo-500/[0.03] to-card p-0 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/60 hover:shadow-[0_12px_30px_-15px_rgba(99,102,241,0.35)] group">
          {hasImages ? (
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
              <Image
                src={primaryImage!}
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
          ) : (
            <div className="relative w-full py-6 px-5 bg-gradient-to-r from-indigo-600/20 via-purple-600/15 to-indigo-900/20 border-b border-indigo-500/20 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                Special Event
              </span>
              <CalendarDays className="h-5 w-5 text-indigo-400 opacity-60" />
            </div>
          )}

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

        <DialogContent className="sm:max-w-[620px] max-h-[85vh] flex flex-col rounded-2xl p-6 overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-bold leading-tight">{event.title}</DialogTitle>
            <DialogDescription asChild>
              <span className="flex flex-wrap items-center text-xs text-muted-foreground mt-1 gap-x-3">
                <span className="flex items-center text-indigo-600 dark:text-indigo-400 font-semibold">
                  <CalendarDays className="h-3.5 w-3.5 mr-1" /> {event.date}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1" /> {event.location}
                </span>
              </span>
            </DialogDescription>
          </DialogHeader>

          {hasImages && (
            <div className="my-3 flex-shrink-0">
              {event.images.length === 1 ? (
                <div 
                  onClick={() => setSelectedImage(event.images[0])}
                  className="group relative w-full h-44 rounded-xl overflow-hidden border border-border/80 bg-black/5 cursor-pointer shadow-sm"
                >
                  <Image 
                    src={event.images[0]} 
                    alt={event.title} 
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      <Maximize2 className="h-3.5 w-3.5" />
                      View full image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {event.images.map((imgSrc, index) => (
                    <div 
                      key={index} 
                      onClick={() => setSelectedImage(imgSrc)}
                      className="group relative h-36 rounded-xl overflow-hidden border border-border/80 bg-black/5 cursor-pointer shadow-sm"
                    >
                      <Image 
                        src={imgSrc} 
                        alt={`${event.title} - image ${index + 1}`} 
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="300px"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                          <Maximize2 className="h-3 w-3" />
                          Enlarge
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <ScrollArea className="flex-grow pr-2 -mr-2 max-h-[300px]">
            <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
              {event.story}
            </p>
          </ScrollArea>

          {event.link && (
            <div className="pt-3 mt-3 border-t border-border flex-shrink-0">
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <ExternalLink className="h-4 w-4" />
                View Project Details
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-h-[90vh] max-w-[90vw] h-[80vh] w-[85vw]">
            <Image
              src={selectedImage}
              alt="Enlarged event image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
