import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Ticket, Sparkles } from 'lucide-react';
import { EventItem } from '@/lib/types';
import { formatDateIndo, formatRupiah } from '@/lib/utils';

interface EventCardProps {
  event: EventItem;
}

export default function EventCard({ event }: EventCardProps) {
  // Hitung harga terendah tiket
  const prices = event.ticketTiers.map((t) => t.price);
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;

  // Hitung kuota tersisa
  const totalQuota = event.ticketTiers.reduce((acc, t) => acc + t.quota, 0);
  const totalSold = event.ticketTiers.reduce((acc, t) => acc + t.soldCount, 0);
  const isAlmostSoldOut = totalSold / totalQuota > 0.8;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1.5"
    >
      {/* Image Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-800">
        <img
          src={event.thumbnailUrl || event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Badges Top Left & Right */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {event.category && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-slate-900/80 text-indigo-300 backdrop-blur-md border border-indigo-500/30">
              {event.category.name}
            </span>
          )}
          {event.isFeatured && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Pilihan
            </span>
          )}
        </div>

        {isAlmostSoldOut && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/90 text-slate-950 uppercase tracking-wider backdrop-blur-sm">
            Hampir Habis
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tanggal */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-pink-400 mb-2">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{formatDateIndo(event.startDate)}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug mb-2">
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 line-clamp-1 mb-4">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{event.venueName}, {event.city}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Mulai dari</span>
            <span className="text-base font-bold text-white tracking-tight">
              {formatRupiah(lowestPrice)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <Ticket className="w-3.5 h-3.5" />
            <span>Pilih</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
