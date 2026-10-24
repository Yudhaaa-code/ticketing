'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  Ticket as TicketIcon, 
  MapPin, 
  CheckCircle2, 
  Printer, 
  Search, 
  QrCode,
  Download,
  Clock,
  Lock,
  CreditCard
} from 'lucide-react';
import { Ticket } from '@/lib/types';
import { formatDateIndo, formatDateTimeIndo } from '@/lib/utils';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'USED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  const loadTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      if (data.success && data.data) {
        setTickets(data.data);

        const qrMap: Record<string, string> = {};
        for (const t of data.data) {
          if (t.orderStatus === 'PAID') {
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
        }
        setQrImages(qrMap);
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handlePayPendingOrder = async (orderId: string) => {
    setPayingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/pay`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await loadTickets();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPayingOrderId(null);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (activeTab === 'ACTIVE' && (t.orderStatus !== 'PAID' || t.isCheckedIn)) return false;
    if (activeTab === 'PENDING' && t.orderStatus !== 'PENDING') return false;
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
            <TicketIcon className="w-4 h-4" />
            <span>Dompet Tiket</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tiket & E-Voucher Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tunjukkan QR Code di gerbang masuk saat hari pelaksanaan acara
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Tiket</span>
          </button>
          <Link
            href="/organizer/scan"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>Simulasi Scanner</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 w-full sm:w-auto shadow-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'ACTIVE'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Siap Pakai ({tickets.filter((t) => t.orderStatus === 'PAID' && !t.isCheckedIn).length})
          </button>
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'PENDING'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-50'
            }`}
          >
            Belum Lunas ({tickets.filter((t) => t.orderStatus === 'PENDING').length})
          </button>
          <button
            onClick={() => setActiveTab('USED')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'USED'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sudah Check-in ({tickets.filter((t) => t.isCheckedIn).length})
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
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 shadow-xs"
          />
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">
          Memuat daftar tiket Anda...
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="space-y-5">
          {filteredTickets.map((ticket) => {
            const qrImage = qrImages[ticket.id];

            return (
              <div
                key={ticket.id}
                className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm transition-all hover:border-slate-300"
              >
                {/* Header Badge */}
                <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-orange-600 font-bold tracking-wider">
                      {ticket.ticketCode}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-700 font-medium">
                      {ticket.ticketTierName || 'Reguler'}
                    </span>
                  </div>

                  <div>
                    {ticket.orderStatus === 'PENDING' ? (
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Menunggu Pembayaran
                      </span>
                    ) : ticket.isCheckedIn ? (
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Sudah Digunakan
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1">
                        <TicketIcon className="w-3.5 h-3.5" />
                        Siap Digunakan
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Left Info */}
                  <div className="flex-1 space-y-4 text-left w-full">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">
                        {ticket.eventTitle || 'Event PassGo'}
                      </h3>
                      {ticket.eventVenue && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{ticket.eventVenue}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-500 block font-medium">Nama Pemegang Tiket</span>
                        <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                          {ticket.attendeeName}
                        </span>
                        <span className="text-slate-500 text-[11px]">{ticket.attendeeEmail}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 block font-medium">Tanggal Acara</span>
                        <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                          {ticket.eventDate ? formatDateIndo(ticket.eventDate) : '-'}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {ticket.eventDate ? formatDateTimeIndo(ticket.eventDate) : ''}
                        </span>
                      </div>
                    </div>

                    {ticket.isCheckedIn && ticket.checkedInAt && (
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Check-in tercatat pada {new Date(ticket.checkedInAt).toLocaleString('id-ID')}</span>
                      </div>
                    )}
                  </div>

                  {/* Right QR Box */}
                  <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 border border-slate-200 shrink-0 text-center w-full md:w-auto">
                    {ticket.orderStatus === 'PENDING' ? (
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-lg bg-amber-50 border-2 border-dashed border-amber-300 flex flex-col items-center justify-center p-2 text-center">
                          <Lock className="w-8 h-8 text-amber-600 mb-1" />
                          <span className="text-[10px] font-bold text-amber-900 leading-tight">QR TERKUNCI</span>
                          <span className="text-[9px] text-amber-700 mt-0.5 leading-tight">Belum Dibayar</span>
                        </div>

                        <span className="text-[10px] font-mono text-amber-700 font-bold tracking-wider mt-2">
                          BELUM DAPAT DIGUNAKAN
                        </span>

                        <button
                          type="button"
                          onClick={() => handlePayPendingOrder(ticket.orderId)}
                          disabled={payingOrderId === ticket.orderId}
                          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{payingOrderId === ticket.orderId ? 'Memproses...' : 'Bayar Sekarang'}</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        {qrImage ? (
                          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                            <img
                              src={qrImage}
                              alt={`QR Code ${ticket.ticketCode}`}
                              className="w-32 h-32 object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-32 h-32 bg-slate-200 animate-pulse rounded-lg flex items-center justify-center">
                            <QrCode className="w-8 h-8 text-slate-400" />
                          </div>
                        )}

                        <span className="text-[10px] font-mono text-slate-500 font-semibold tracking-wider mt-2">
                          SCAN DI GERBANG MASUK
                        </span>

                        {qrImage && (
                          <button
                            type="button"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = qrImage;
                              link.download = `PassGo-Tiket-${ticket.ticketCode}.png`;
                              link.click();
                            }}
                            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-300 hover:border-orange-500 hover:text-orange-600 text-[11px] font-semibold text-slate-700 shadow-xs transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-orange-600" />
                            <span>Unduh Barcode (PNG)</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
            <TicketIcon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Belum Ada Tiket</h3>
          <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">
            Anda belum memiliki tiket aktif. Temukan konser favorit atau atraksi hiburan seru sekarang.
          </p>
          <Link
            href="/explore"
            className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            Jelajah & Beli Tiket
          </Link>
        </div>
      )}
    </div>
  );
}
