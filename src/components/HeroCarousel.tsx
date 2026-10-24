'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Ticket } from 'lucide-react';
import { EventItem } from '@/lib/types';
import { formatDateIndo, formatRupiah } from '@/lib/utils';

interface HeroCarouselProps {
  events: EventItem[];
}

export default function HeroCarousel({ events }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const featured = events.slice(0, 4);

  useEffect(() => {
    if (featured.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featured.length, isPaused]);

  if (featured.length === 0) return null;

  const currentEvent = featured[currentIndex];
  const lowestPrice = currentEvent.ticketTiers.length > 0 
    ? Math.min(...currentEvent.ticketTiers.map((t) => t.price)) 
    : 0;

  return (
    <div 
      className="relative w-full rounded-2xl overflow-hidden shadow-md bg-slate-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Banner Image with Smooth Fade */}
      <div className="relative aspect-[21/9] min-h-[260px] sm:min-h-[360px] md:min-h-[420px] w-full overflow-hidden">
        <img
          src={currentEvent.bannerUrl}
          alt={currentEvent.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Gradients for high readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent sm:bg-gradient-to-r sm:from-slate-950/90 sm:via-slate-950/50 sm:to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 sm:p-10 md:p-12 flex flex-col justify-end sm:justify-center max-w-2xl text-left z-10">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-orange-600 text-white shadow-xs">
              Sedang Populer
            </span>
            {currentEvent.category && (
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/90 text-slate-800 backdrop-blur-xs">
                {currentEvent.category.name}
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-2 sm:mb-3 line-clamp-2">
            {currentEvent.title}
          </h2>

          {currentEvent.tagline && (
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed hidden sm:block">
              {currentEvent.tagline}
            </p>
          )}

          {/* Metadata & CTA */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mb-5">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>{formatDateIndo(currentEvent.startDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{currentEvent.venueName}, {currentEvent.city}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/events/${currentEvent.slug}`}
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Beli Tiket • Mulai {formatRupiah(lowestPrice)}</span>
            </Link>

            <Link
              href={`/events/${currentEvent.slug}`}
              className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md transition-all hidden sm:inline-block"
            >
              Detail Acara
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={() => setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => setCurrentIndex((prev) => (prev + 1) % featured.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-3 right-4 sm:right-8 flex items-center gap-1.5 z-20">
        {featured.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === currentIndex ? 'w-6 bg-orange-500' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
