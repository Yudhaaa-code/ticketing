import React, { Suspense } from 'react';
import Link from 'next/link';
import { Search, MapPin, Filter, Sparkles, Frown } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Jelajah Semua Event</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {selectedCategory ? selectedCategory.name : 'Temukan Event Menarik'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Menampilkan {events.length} event tersedia di Indonesia
        </p>
      </div>

      {/* Filter Bar & Search */}
      <div className="mb-8 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col md:flex-row gap-3 items-center justify-between">
        <form
          action="/explore"
          method="GET"
          className="w-full flex flex-col sm:flex-row gap-2.5"
        >
          {/* Preserve category if selected */}
          {categorySlug && <input type="hidden" name="category" value={categorySlug} />}

          {/* Search Input */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800 flex-1">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              name="search"
              defaultValue={search || ''}
              placeholder="Cari nama event, artis, atau wahana..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800 sm:w-52">
            <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
            <select
              name="city"
              defaultValue={city || ''}
              className="w-full bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-slate-200">Semua Kota</option>
              <option value="Jakarta" className="bg-slate-900 text-slate-200">Jakarta</option>
              <option value="Bandung" className="bg-slate-900 text-slate-200">Bandung</option>
              <option value="Tangerang" className="bg-slate-900 text-slate-200">Tangerang</option>
            </select>
          </div>

          {/* Filter Submit */}
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
          >
            Terapkan Filter
          </button>
        </form>
      </div>

      {/* Category Horizontal Filter */}
      <div className="mb-8">
        <Suspense fallback={<div className="h-10 bg-slate-800/40 rounded-full" />}>
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
        <div className="py-20 flex flex-col items-center justify-center text-center bg-slate-900/30 rounded-3xl border border-slate-800/80 p-8">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
            <Frown className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Event Tidak Ditemukan</h3>
          <p className="text-sm text-slate-400 max-w-md mb-6">
            Maaf, kami tidak menemukan event yang cocok dengan filter pencarian Anda. Coba cari kata kunci lain atau pilih kota yang berbeda.
          </p>
          <Link
            href="/explore"
            className="px-6 py-2.5 rounded-full bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all"
          >
            Reset Semua Filter
          </Link>
        </div>
      )}
    </div>
  );
}
