'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  Ticket as TicketIcon, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Download, 
  Printer, 
  Sparkles,
  Search,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { Ticket } from '@/lib/types';
import { formatDateIndo, formatDateTimeIndo } from '@/lib/utils';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'USED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/tickets')
      .then((res) => res.json())
      .then(async (res) => {
        if (res.success && res.data) {
          setTickets(res.data);

          // Generate QR Code data URLs for each ticket
          const qrMap: Record<string, string> = {};
          for (const t of res.data) {
            try {
              const dataUrl = await QRCode.toDataURL(t.qrData || t.ticketCode, {
                width: 250,
                margin: 1,
                color: {
                  dark: '#0f172a',
                  light: '#ffffff',
                },
              });
              qrMap[t.id] = dataUrl;
            } catch (err) {
              console.error('QR generation error:', err);
            }
          }
          setQrImages(qrMap);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTickets = tickets.filter((t) => {
    if (activeTab === 'ACTIVE' && t.isCheckedIn) return false;
    if (activeTab === 'USED' && !t.isCheckedIn) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.eventTitle?.toLowerCase().includes(q) ||
        t.ticketCode.toLowerCase().includes(q) ||
        t.attendeeName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-pink-500 text-xs font-bold uppercase tracking-wider mb-1">
            <TicketIcon className="w-4 h-4" />
            <span>Dompet Tiket</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tiket & E-Voucher Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tunjukkan QR Code di gerbang masuk saat hari H pelaksanaan acara
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            <Printer className="w-4 h-4 text-indigo-400" />
            <span>Cetak Tiket</span>
          </button>
          <Link
            href="/organizer/scan"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
          >
            <QrCode className="w-4 h-4" />
            <span>Simulasi Scanner</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ALL'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ACTIVE'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aktif ({tickets.filter((t) => !t.isCheckedIn).length})
          </button>
          <button
            onClick={() => setActiveTab('USED')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'USED'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Selesai Check-in ({tickets.filter((t) => t.isCheckedIn).length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode tiket atau event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Memuat daftar tiket Anda...
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="space-y-6">
          {filteredTickets.map((ticket) => {
            const qrImage = qrImages[ticket.id];

            return (
              <div
                key={ticket.id}
                className="relative rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-xl transition-all hover:border-slate-700"
              >
                {/* Header Badge */}
                <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-indigo-400 font-bold tracking-wider">
                      {ticket.ticketCode}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300 font-medium">
                      {ticket.ticketTierName || 'Reguler'}
                    </span>
                  </div>

                  <div>
                    {ticket.isCheckedIn ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Sudah Digunakan
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                        Siap Digunakan
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Left Info */}
                  <div className="flex-1 space-y-4 text-left w-full">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                        {ticket.eventTitle || 'Event GoersTicket'}
                      </h3>
                      {ticket.eventVenue && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                          <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                          <span>{ticket.eventVenue}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-500 block font-medium">Nama Pemegang Tiket</span>
                        <span className="font-bold text-white text-sm mt-0.5 block">
                          {ticket.attendeeName}
                        </span>
                        <span className="text-slate-400 text-[11px]">{ticket.attendeeEmail}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 block font-medium">Tanggal Acara</span>
                        <span className="font-bold text-white text-sm mt-0.5 block">
                          {ticket.eventDate ? formatDateIndo(ticket.eventDate) : '-'}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {ticket.eventDate ? formatDateTimeIndo(ticket.eventDate) : ''}
                        </span>
                      </div>
                    </div>

                    {ticket.isCheckedIn && ticket.checkedInAt && (
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Check-in tercatat pada {new Date(ticket.checkedInAt).toLocaleString('id-ID')}</span>
                      </div>
                    )}
                  </div>

                  {/* Right QR Box */}
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 text-center w-full md:w-auto">
                    {qrImage ? (
                      <div className="bg-white p-2.5 rounded-xl shadow-md">
                        <img
                          src={qrImage}
                          alt={`QR Code ${ticket.ticketCode}`}
                          className="w-36 h-36 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-36 h-36 bg-slate-800 animate-pulse rounded-xl flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-slate-600" />
                      </div>
                    )}

                    <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-widest mt-2">
                      SCAN ON ARRIVAL
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-slate-900/30 rounded-3xl border border-slate-800 p-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
            <TicketIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Belum Ada Tiket</h3>
          <p className="text-sm text-slate-400 max-w-sm mb-6">
            Anda belum memiliki tiket aktif. Cari event konser, atraksi, atau workshop menarik sekarang!
          </p>
          <Link
            href="/explore"
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
          >
            Jelajah & Beli Tiket
          </Link>
        </div>
      )}
    </div>
  );
}
