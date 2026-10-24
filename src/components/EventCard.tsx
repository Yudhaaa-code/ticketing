import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Ticket } from 'lucide-react';
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
  const isAlmostSoldOut = totalQuota > 0 && totalSold / totalQuota > 0.8;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden bg-white border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200"
    >
      {/* Image Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={event.thumbnailUrl || event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Badges Top Left & Right */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {event.category && (
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs">
              {event.category.name}
            </span>
          )}
          {event.isFeatured && (
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-orange-600 text-white shadow-sm">
              Unggulan
            </span>
          )}
        </div>

        {isAlmostSoldOut && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider shadow-sm">
            Hampir Habis
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tanggal */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 mb-2">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{formatDateIndo(event.startDate)}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug mb-2">
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 line-clamp-1 mb-4">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{event.venueName}, {event.city}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Mulai dari</span>
            <span className="text-base font-extrabold text-slate-900 tracking-tight">
              {formatRupiah(lowestPrice)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <Ticket className="w-3.5 h-3.5" />
            <span>Beli Tiket</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
