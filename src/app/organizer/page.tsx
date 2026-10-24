import React from 'react';
import Link from 'next/link';
import { 
  Ticket, 
  TrendingUp, 
  Calendar, 
  PlusCircle, 
  QrCode, 
  ExternalLink
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Penyelenggara
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau kinerja penjualan tiket, manajemen event, dan scan onsite
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/organizer/scan"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold shadow-xs transition-all"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Onsite Scanner</span>
          </Link>
          <Link
            href="/organizer/events/create"
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Event Baru</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total Pendapatan Tiket</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {formatRupiah(totalRevenue)}
            </span>
            <span className="text-[11px] text-emerald-600 mt-1 inline-flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>Pencairan dana otomatis H+1</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Tiket Terjual</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {totalSold.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Dari {events.length} event terpublikasi
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Event Aktif</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {events.length}
            </span>
            <span className="text-[11px] text-orange-600 mt-1 block font-medium">
              Semua status terverifikasi
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Event List Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">Daftar Event Anda</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-3">
              <tr>
                <th className="pb-3 font-semibold">Nama Event</th>
                <th className="pb-3 font-semibold">Tanggal</th>
                <th className="pb-3 font-semibold">Lokasi</th>
                <th className="pb-3 font-semibold">Penjualan Tiket</th>
                <th className="pb-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((evt) => {
                const sold = evt.ticketTiers.reduce((acc, t) => acc + t.soldCount, 0);
                const totalQ = evt.ticketTiers.reduce((acc, t) => acc + t.quota, 0);
                const pct = totalQ > 0 ? Math.round((sold / totalQ) * 100) : 0;

                return (
                  <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.thumbnailUrl || evt.bannerUrl}
                          alt={evt.title}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">{evt.title}</span>
                          <span className="text-slate-500 text-[11px]">{evt.category?.name || 'Event'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-slate-600 font-medium">
                      {formatDateIndo(evt.startDate)}
                    </td>
                    <td className="py-4 pr-4 text-slate-500">
                      {evt.venueName}, {evt.city}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="w-36">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-900 font-semibold">{sold}/{totalQ}</span>
                          <span className="text-orange-600 font-bold">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-orange-600 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/events/${evt.slug}`}
                        className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold"
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
