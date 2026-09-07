import React, { Suspense } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  ShieldCheck, 
  Ticket, 
  Award,
  Zap
} from 'lucide-react';
import { dataService, initialCategories } from '@/lib/data';
import EventCard from '@/components/EventCard';
import CategoryBar from '@/components/CategoryBar';

export default function HomePage() {
  const featuredEvents = dataService.getAllEvents({ isFeatured: true });
  const popularEvents = dataService.getAllEvents({ isPopular: true });
  const allEvents = dataService.getAllEvents();

  return (
    <div className="flex flex-col w-full">
      {/* 🌟 HERO SECTION */}
      <section className="relative w-full overflow-hidden hero-gradient pt-10 pb-16 md:pt-16 md:pb-24 border-b border-slate-800/80">
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-indigo-500/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-pink-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Badge Trending */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 backdrop-blur-md shadow-lg shadow-indigo-950/50">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span>Platform Ticketing & Event Terlengkap #1 Indonesia</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            Temukan Sensasi & Tiket Event Impian Anda di{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400">
              GoersTicket
            </span>
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Mulai dari konser musik akbar, wahana Dufan Ancol, festival kuliner hingga konferensi teknologi. Pesan tiket aman dengan konfirmasi QR code instan!
          </p>

          {/* 🔍 Search Box Widget */}
          <div className="mt-8 sm:mt-10 w-full max-w-3xl">
            <form
              action="/explore"
              method="GET"
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2"
            >
              {/* Keyword input */}
              <div className="flex items-center gap-3 px-3.5 py-2.5 w-full sm:flex-1 bg-slate-950/60 rounded-xl border border-slate-800">
                <Search className="w-4 h-4 text-indigo-400 shrink-0" />
                <input
                  type="text"
                  name="search"
                  placeholder="Cari konser, artis, festival, atau Dufan..."
                  className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* City selector */}
              <div className="flex items-center gap-3 px-3.5 py-2.5 w-full sm:w-48 bg-slate-950/60 rounded-xl border border-slate-800">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                <select
                  name="city"
                  className="w-full bg-transparent text-sm text-slate-300 focus:outline-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" className="bg-slate-900 text-slate-300">Semua Kota</option>
                  <option value="Jakarta" className="bg-slate-900 text-slate-300">Jakarta</option>
                  <option value="Bandung" className="bg-slate-900 text-slate-300">Bandung</option>
                  <option value="Tangerang" className="bg-slate-900 text-slate-300">Tangerang</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Cari Event</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Mini Badges Under Search */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Tiket Resmi 100% Anti-Scam</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>E-Tiket & Barcode Instan</span>
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-pink-400" />
              <span>Scan Onsite Anti-Ribet</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🏷️ CATEGORY BAR SECTION */}
      <section className="w-full border-b border-slate-850 bg-slate-950/60 sticky top-16 sm:top-20 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Suspense fallback={<div className="h-10 animate-pulse bg-slate-800/40 rounded-full" />}>
            <CategoryBar />
          </Suspense>
        </div>
      </section>

      {/* ⭐ FEATURED EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-pink-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Pilihan Editor</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Event Paling Hits & Unggulan
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Tiket paling banyak dicari dan direkomendasikan minggu ini
            </p>
          </div>

          <Link
            href="/explore?featured=true"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>

      {/* 🎪 CATEGORY GRID CARDS */}
      <section className="w-full bg-slate-900/30 border-y border-slate-850 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Jelajahi Berdasarkan Minat
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Pilih kategori favoritmu untuk menemukan aktivitas liburan dan hiburan terbaik
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {initialCategories.map((category) => (
              <Link
                key={category.id}
                href={`/explore?category=${category.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] p-4 flex flex-col justify-end border border-slate-800 hover:border-indigo-500/50 transition-all hover:scale-105 hover:shadow-xl"
              >
                {/* Background Image */}
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                {/* Content */}
                <div className="relative z-10">
                  <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-indigo-300 transition-colors">
                    {category.name}
                  </h4>
                  <span className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                    <span>Lihat Tiket</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 POPULAR & TRENDING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>Sedang Trending</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Event Populer di Dekatmu
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Jangan sampai kehabisan tiket, amankan kuota Anda sekarang
            </p>
          </div>

          <Link
            href="/explore"
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Semua Event</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>

      {/* 🚀 CTA BANNER: FOR EVENT ORGANIZER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900/90 via-purple-900/80 to-slate-900 border border-indigo-500/30 p-8 sm:p-12">
          {/* Ambient light */}
          <div className="absolute -right-16 -top-16 w-72 h-72 bg-pink-500/20 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-4">
                <Award className="w-3.5 h-3.5" />
                <span>Goers Experience Manager (GEM)</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Punya Event Sendiri? Jual Tiketmu di Sini!
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Kelola penjualan tiket, manajemen kuota kategori, pembayaran QRIS otomatis, dan validasi tiket onsite menggunakan kamera scanner dalam satu dashboard terintegrasi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="/organizer/events/create"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm shadow-xl shadow-pink-600/30 transition-all text-center"
              >
                Buat Event Sekarang
              </Link>
              <Link
                href="/organizer/scan"
                className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all text-center flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4 text-indigo-400" />
                <span>Buka Scanner Tiket</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
