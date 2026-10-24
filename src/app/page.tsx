import React, { Suspense } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Ticket,
  Flame,
  CalendarDays,
  Clock
} from 'lucide-react';
import { dataService, initialCategories } from '@/lib/data';
import EventCard from '@/components/EventCard';
import CategoryBar from '@/components/CategoryBar';
import HeroCarousel from '@/components/HeroCarousel';

export default function HomePage() {
  const featuredEvents = dataService.getAllEvents({ isFeatured: true });
  const popularEvents = dataService.getAllEvents({ isPopular: true });

  return (
    <div className="flex flex-col w-full bg-slate-50">
      {/* HERO SECTION */}
      <section className="relative w-full bg-gradient-to-b from-orange-50/80 via-slate-50 to-slate-50 pt-8 pb-12 md:pt-14 md:pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          
          {/* Quick Notice Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-orange-200 text-orange-700 text-xs font-semibold mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Tiket Konser & Festival 2026 Tersedia Sekarang</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 max-w-4xl text-center leading-tight">
            Cari & Beli Tiket Event Favoritmu di{' '}
            <span className="text-orange-600">PassGo</span>
          </h1>

          <p className="mt-4 text-sm sm:text-lg text-slate-600 max-w-2xl text-center leading-relaxed">
            Mulai dari konser musik akbar, wahana atraksi Dufan Ancol, festival kuliner hingga seminar teknologi. E-tiket instan dengan barcode resmi anti-scam.
          </p>

          {/* Search Box Widget */}
          <div className="mt-8 w-full max-w-3xl">
            <form
              action="/explore"
              method="GET"
              className="p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200 shadow-md flex flex-col sm:flex-row items-center gap-2"
            >
              {/* Keyword input */}
              <div className="flex items-center gap-3 px-3.5 py-2.5 w-full sm:flex-1 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  name="search"
                  placeholder="Cari konser, artis, festival, atau Dufan..."
                  className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* City selector */}
              <div className="flex items-center gap-3 px-3.5 py-2.5 w-full sm:w-48 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <select
                  name="city"
                  className="w-full bg-transparent text-sm text-slate-700 focus:outline-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="">Semua Kota</option>
                  <option value="Jakarta">Jakarta</option>
                  <option value="Bandung">Bandung</option>
                  <option value="Tangerang">Tangerang</option>
                  <option value="Surabaya">Surabaya</option>
                  <option value="Bali">Bali</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>Cari Tiket</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Time Filters under search bar */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Filter Cepat:
              </span>
              <Link
                href="/explore"
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                Semua Jadwal
              </Link>
              <Link
                href="/explore?time=weekend"
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-orange-300 hover:text-orange-600 transition-colors font-medium"
              >
                🎉 Weekend Ini
              </Link>
              <Link
                href="/explore?time=month"
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                Bulan Ini
              </Link>
              <Link
                href="/explore?category=konser-musik"
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                🎤 Konser Hits
              </Link>
            </div>
          </div>

          {/* Mini Trust Highlights */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tiket Resmi 100% Terverifikasi</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>E-Tiket & QR Code Instan</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Ticket className="w-4 h-4 text-slate-700" />
              <span>Check-in Cepat Onsite</span>
            </div>
          </div>

          {/* Featured Event Slider / Carousel */}
          <div className="mt-8 sm:mt-12 w-full">
            <HeroCarousel events={featuredEvents} />
          </div>
        </div>
      </section>

      {/* CATEGORY BAR SECTION (STICKY) */}
      <section className="w-full border-b border-slate-200 bg-white/95 sticky top-16 sm:top-20 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Suspense fallback={<div className="h-10 animate-pulse bg-slate-100 rounded-lg" />}>
            <CategoryBar />
          </Suspense>
        </div>
      </section>

      {/* FEATURED EVENTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
              <CalendarDays className="w-4 h-4" />
              <span>Pilihan Minggu Ini</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Event Paling Hits & Unggulan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tiket paling banyak dicari dan direkomendasikan minggu ini
            </p>
          </div>

          <Link
            href="/explore?featured=true"
            className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
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

      {/* CATEGORY GRID CARDS */}
      <section className="w-full bg-slate-100/70 border-y border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Jelajahi Berdasarkan Kategori
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Temukan aktivitas liburan, konser musik, dan hiburan favoritmu
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {initialCategories.map((category) => (
              <Link
                key={category.id}
                href={`/explore?category=${category.slug}`}
                className="group relative rounded-xl overflow-hidden aspect-[4/5] p-4 flex flex-col justify-end border border-slate-200 bg-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                {/* Background Image */}
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />

                {/* Content */}
                <div className="relative z-10">
                  <h4 className="font-bold text-sm text-white group-hover:text-orange-300 transition-colors">
                    {category.name}
                  </h4>
                  <span className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5 font-medium">
                    <span>Lihat Tiket</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR & TRENDING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>Sedang Ramai</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Event Populer di Dekatmu
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Amankan kuota tiket sebelum kehabisan
            </p>
          </div>

          <Link
            href="/explore"
            className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
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

      {/* CTA BANNER: FOR EVENT ORGANIZER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-8 sm:p-12 text-white">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-500/20 text-orange-400 text-xs font-bold mb-4">
                <span>Mitra Penyelenggara Event</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Punya Event Sendiri? Jual Tiketmu di PassGo
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Kelola kuota tiket, sistem pembayaran QRIS otomatis, dan validasi tiket onsite menggunakan kamera scanner dalam satu dashboard terintegrasi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="/organizer/events/create"
                className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-sm transition-all text-center"
              >
                Buat Event Sekarang
              </Link>
              <Link
                href="/organizer/scan"
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all text-center flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4 text-orange-400" />
                <span>Buka Scanner Onsite</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
