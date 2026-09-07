import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Share2, 
  ShieldCheck, 
  Info, 
  ExternalLink,
  Sparkles,
  Ticket as TicketIcon
} from 'lucide-react';
import { dataService } from '@/lib/data';
import { formatDateIndo, formatDateTimeIndo } from '@/lib/utils';
import TicketPicker from '@/components/TicketPicker';

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = dataService.getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="w-full pb-20">
      {/* 🖼️ Hero Banner Image */}
      <div className="relative w-full h-64 sm:h-96 md:h-[420px] bg-slate-900 overflow-hidden">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {event.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {event.category.name}
                  </span>
                )}
                {event.isFeatured && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-pink-400" />
                    Pilihan Goers
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                {event.title}
              </h1>

              {event.tagline && (
                <p className="text-sm sm:text-base text-slate-300 mt-2 font-medium">
                  {event.tagline}
                </p>
              )}

              {/* Event Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Jadwal Acara</span>
                    <span className="font-semibold text-white">
                      {formatDateIndo(event.startDate)}
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      {formatDateTimeIndo(event.startDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Lokasi Venue</span>
                    <span className="font-semibold text-white">{event.venueName}</span>
                    <span className="text-xs text-slate-400 block mt-0.5">{event.city}</span>
                    {event.mapsUrl && (
                      <a
                        href={event.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-1"
                      >
                        <span>Lihat di Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            {event.organizer && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-black text-lg text-white">
                    {event.organizer.organizationName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm">
                        {event.organizer.organizationName}
                      </span>
                      {event.organizer.verified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <span className="text-xs text-slate-400">Penyelenggara Resmi Terverifikasi</span>
                  </div>
                </div>

                {event.organizer.phone && (
                  <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300">
                    Kontak: {event.organizer.phone}
                  </span>
                )}
              </div>
            )}

            {/* 🎟️ TIKET SELECTION */}
            <div id="tickets-section" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-lg sm:text-xl">
                  <TicketIcon className="w-5 h-5 text-indigo-400" />
                  <span>Pilih Kategori Tiket</span>
                </div>
                <span className="text-xs text-slate-400">
                  {event.ticketTiers.length} kategori tiket tersedia
                </span>
              </div>

              <TicketPicker event={event} />
            </div>

            {/* Deskripsi Event */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Tentang Acara</h3>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>

            {/* Syarat & Ketentuan */}
            {event.terms && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80">
                <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
                  <Info className="w-4 h-4 text-pink-400" />
                  <span>Syarat & Ketentuan Kunjungan</span>
                </div>
                <div className="text-slate-400 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {event.terms}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary (Col 3) */}
          <div className="space-y-6">
            <div className="sticky top-24 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md space-y-5">
              <h4 className="font-bold text-white text-base">Informasi Pemesanan</h4>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>E-Tiket resmi terbit otomatis begitu pembayaran sukses</span>
                </li>
                <li className="flex items-center gap-2">
                  <TicketIcon className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>Tunjukkan QR Code di pintu masuk untuk ditukar gelang/akses</span>
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Cek detail jadwal acara sebelum hari pelaksanaan</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-slate-800">
                <a
                  href="#tickets-section"
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm text-center block transition-all shadow-lg shadow-indigo-600/20"
                >
                  Pilih Tiket Sekarang
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
