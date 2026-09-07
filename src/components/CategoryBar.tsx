'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Music2, 
  FerrisWheel, 
  Sparkles, 
  Trophy, 
  GraduationCap, 
  Palette, 
  LayoutGrid 
} from 'lucide-react';
import { initialCategories } from '@/lib/data';

const iconMap: Record<string, any> = {
  Music2,
  FerrisWheel,
  Sparkles,
  Trophy,
  GraduationCap,
  Palette,
};

export default function CategoryBar() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2.5 min-w-max">
        {/* Semua Event Button */}
        <Link
          href="/explore"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
            !currentCategory
              ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Semua Kategori</span>
        </Link>

        {/* Categories */}
        {initialCategories.map((cat) => {
          const Icon = cat.icon ? iconMap[cat.icon] || Sparkles : Sparkles;
          const isActive = currentCategory === cat.slug;

          return (
            <Link
              key={cat.id}
              href={`/explore?category=${cat.slug}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
