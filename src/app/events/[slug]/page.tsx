import React from 'react';
import { notFound } from 'next/navigation';
import { 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Info, 
  ExternalLink,
  Ticket as TicketIcon,
  Zap,
  Lock
} from 'lucide-react';
import { dataService } from '@/lib/data';
import { formatDateIndo, formatDateTimeIndo } from '@/lib/utils';
import TicketPicker from '@/components/TicketPicker';
import ShareButtons from '@/components/ShareButtons';

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = dataService.getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const isHighDemand = event.isPopular || event.isFeatured;

  return (
    <div className="w-full pb-20 bg-slate-50 min-h-screen">
      {/* Hero Banner Image */}
      <div className="relative w-full h-64 sm:h-96 md:h-[400px] bg-slate-900 overflow-hidden">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-md">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {event.category && (
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800">
                    {event.category.name}
                  </span>
                )}
                {event.isFeatured && (
                  <span className="px-3 py-1 rounded-md text-xs font-bold bg-orange-600 text-white">
                    Pilihan Utama
                  </span>
                )}
                {isHighDemand && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                    <span>Permintaan Tinggi</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                {event.title}
              </h1>

              {event.tagline && (
                <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
                  {event.tagline}
                </p>
              )}

              {/* Event Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block font-medium">Jadwal Acara</span>
                    <span className="font-bold text-slate-900">
                      {formatDateIndo(event.startDate)}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {formatDateTimeIndo(event.startDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block font-medium">Lokasi Venue</span>
                    <span className="font-bold text-slate-900">{event.venueName}</span>
                    <span className="text-xs text-slate-500 block mt-0.5">{event.city}</span>
                    {event.mapsUrl && (
                      <a
                        href={event.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-semibold mt-1"
                      >
                        <span>Buka di Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Share Buttons Component */}
              <ShareButtons title={event.title} />
            </div>

            {/* Organizer Info */}
            {event.organizer && (
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-orange-600 flex items-center justify-center font-black text-base text-white">
                    {event.organizer.organizationName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-sm">
                        {event.organizer.organizationName}
                      </span>
                      {event.organizer.verified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500">Penyelenggara Resmi Terverifikasi</span>
                  </div>
                </div>

                {event.organizer.phone && (
                  <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                    Kontak: {event.organizer.phone}
                  </span>
                )}
              </div>
            )}

            {/* TIKET SELECTION */}
            <div id="tickets-section" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-lg sm:text-xl">
                  <TicketIcon className="w-5 h-5 text-orange-600" />
                  <span>Pilih Kategori Tiket</span>
                </div>
                <span className="text-xs text-slate-500">
                  {event.ticketTiers.length} kategori tiket tersedia
                </span>
              </div>

              <TicketPicker event={event} />
            </div>

            {/* Deskripsi Event */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Tentang Acara</h3>
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>

            {/* Syarat & Ketentuan */}
            {event.terms && (
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-3">
                  <Info className="w-4 h-4 text-orange-600" />
                  <span>Syarat & Ketentuan Kunjungan</span>
                </div>
                <div className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {event.terms}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary (Col 3) */}
          <div className="space-y-6">
            <div className="sticky top-24 p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-5">
              <h4 className="font-bold text-slate-900 text-base">Informasi Pemesanan</h4>

              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>E-Tiket resmi otomatis terbit setelah pembayaran berhasil</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <TicketIcon className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>Tunjukkan QR Code di pintu masuk untuk validasi akses</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-slate-700 shrink-0" />
                  <span>Cek jadwal dan lokasi venue sebelum hari kedatangan</span>
                </li>
              </ul>

              {/* Anti-Bot & Queue Security Badge */}
              <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-orange-800">
                  <Lock className="w-3.5 h-3.5 text-orange-600" />
                  <span>PassGo Queue Guard Active</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Sistem proteksi antrean adil (*Fair Queue*) aktif untuk mencegah calo tiket dan transaksi bot otomatis.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <a
                  href="#tickets-section"
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm text-center block transition-all shadow-sm"
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
