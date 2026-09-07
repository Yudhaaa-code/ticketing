import React from 'react';
import Link from 'next/link';
import { 
  Ticket, 
  TrendingUp, 
  Users, 
  Calendar, 
  PlusCircle, 
  QrCode, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { dataService } from '@/lib/data';
import { formatRupiah, formatDateIndo } from '@/lib/utils';

export default function OrganizerDashboardPage() {
  const events = dataService.getAllEvents();
  const totalSold = events.reduce(
    (acc, evt) => acc + evt.ticketTiers.reduce((tAcc, t) => tAcc + t.soldCount, 0),
    0
  );
  const totalRevenue = events.reduce(
    (acc, evt) =>
      acc + evt.ticketTiers.reduce((tAcc, t) => tAcc + t.soldCount * t.price, 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Penyelenggara (GEM)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pantau kinerja penjualan tiket, manajemen event, dan pintu masuk onsite
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/organizer/scan"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span>Onsite Scanner</span>
          </Link>
          <Link
            href="/organizer/events/create"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Event Baru</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Total Pendapatan Tiket</span>
            <span className="text-2xl font-black text-white mt-1 block">
              {formatRupiah(totalRevenue)}
            </span>
            <span className="text-[11px] text-emerald-400 mt-1 inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Pencairan dana otomatis H+1</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Tiket Terjual</span>
            <span className="text-2xl font-black text-white mt-1 block">
              {totalSold.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Dari {events.length} event terpublikasi
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Event Aktif</span>
            <span className="text-2xl font-black text-white mt-1 block">
              {events.length}
            </span>
            <span className="text-[11px] text-indigo-400 mt-1 block">
              Semua status terverifikasi
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Event List Table */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Daftar Event Anda</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">
              <tr>
                <th className="pb-3 font-semibold">Nama Event</th>
                <th className="pb-3 font-semibold">Tanggal</th>
                <th className="pb-3 font-semibold">Lokasi</th>
                <th className="pb-3 font-semibold">Penjualan Tiket</th>
                <th className="pb-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {events.map((evt) => {
                const sold = evt.ticketTiers.reduce((acc, t) => acc + t.soldCount, 0);
                const totalQ = evt.ticketTiers.reduce((acc, t) => acc + t.quota, 0);
                const pct = Math.round((sold / totalQ) * 100);

                return (
                  <tr key={evt.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.thumbnailUrl || evt.bannerUrl}
                          alt={evt.title}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <span className="font-bold text-white text-sm block">{evt.title}</span>
                          <span className="text-slate-400 text-[11px]">{evt.category?.name || 'Event'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-slate-300">
                      {formatDateIndo(evt.startDate)}
                    </td>
                    <td className="py-4 pr-4 text-slate-400">
                      {evt.venueName}, {evt.city}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="w-36">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-white font-semibold">{sold}/{totalQ}</span>
                          <span className="text-indigo-400">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/events/${evt.slug}`}
                        className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        <span>Lihat Publik</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
