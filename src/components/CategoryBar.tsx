'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Music2, 
  FerrisWheel, 
  Ticket, 
  Trophy, 
  GraduationCap, 
  Palette, 
  LayoutGrid 
} from 'lucide-react';
import { initialCategories } from '@/lib/data';

const iconMap: Record<string, any> = {
  Music2,
  FerrisWheel,
  Ticket,
  Trophy,
  GraduationCap,
  Palette,
};

export default function CategoryBar() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-2 min-w-max">
        {/* Semua Event Button */}
        <Link
          href="/explore"
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            !currentCategory
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Semua Kategori</span>
        </Link>

        {/* Categories */}
        {initialCategories.map((cat) => {
          const Icon = cat.icon ? iconMap[cat.icon] || Ticket : Ticket;
          const isActive = currentCategory === cat.slug;

          return (
            <Link
              key={cat.id}
              href={`/explore?category=${cat.slug}`}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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
