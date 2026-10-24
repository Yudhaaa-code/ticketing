import React, { Suspense } from 'react';
import Link from 'next/link';
import { Search, MapPin, Frown, Compass } from 'lucide-react';
import { dataService, initialCategories } from '@/lib/data';
import EventCard from '@/components/EventCard';
import CategoryBar from '@/components/CategoryBar';

interface ExplorePageProps {
  searchParams: Promise<{
    category?: string;
    city?: string;
    search?: string;
    featured?: string;
  }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolvedParams = await searchParams;
  const categorySlug = resolvedParams.category;
  const city = resolvedParams.city;
  const search = resolvedParams.search;
  const isFeatured = resolvedParams.featured === 'true';

  const events = dataService.getAllEvents({
    categorySlug,
    city,
    search,
    isFeatured: isFeatured ? true : undefined,
  });

  const selectedCategory = categorySlug
    ? initialCategories.find((c) => c.slug === categorySlug)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-slate-50 min-h-screen">
      {/* Header Title */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>Jelajah Semua Event</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {selectedCategory ? selectedCategory.name : 'Temukan Event Menarik'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Menampilkan {events.length} event tersedia di Indonesia
        </p>
      </div>

      {/* Filter Bar & Search */}
      <div className="mb-6 p-3 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form
          action="/explore"
          method="GET"
          className="w-full flex flex-col sm:flex-row gap-2.5"
        >
          {/* Preserve category if selected */}
          {categorySlug && <input type="hidden" name="category" value={categorySlug} />}

          {/* Search Input */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 flex-1 focus-within:border-orange-500 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              name="search"
              defaultValue={search || ''}
              placeholder="Cari nama event, artis, atau atraksi..."
              className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 sm:w-52 focus-within:border-orange-500 focus-within:bg-white transition-all">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
            <select
              name="city"
              defaultValue={city || ''}
              className="w-full bg-transparent text-sm text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="">Semua Kota</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Bandung">Bandung</option>
              <option value="Tangerang">Tangerang</option>
            </select>
          </div>

          {/* Filter Submit */}
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            Terapkan Filter
          </button>
        </form>
      </div>

      {/* Category Horizontal Filter */}
      <div className="mb-8">
        <Suspense fallback={<div className="h-10 bg-slate-200 rounded-lg animate-pulse" />}>
          <CategoryBar />
        </Suspense>
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <Frown className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Event Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
            Maaf, kami tidak menemukan event yang cocok dengan filter pencarian Anda. Coba cari kata kunci lain atau pilih kota yang berbeda.
          </p>
          <Link
            href="/explore"
            className="px-5 py-2 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition-all shadow-sm"
          >
            Reset Semua Filter
          </Link>
        </div>
      )}
    </div>
  );
}
