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
  Printer, 
  Sparkles, 
  Search, 
  User, 
  Receipt, 
  ShieldCheck, 
  ArrowRight,
  CreditCard,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Ticket, Order } from '@/lib/types';
import { formatDateIndo, formatDateTimeIndo, formatRupiah } from '@/lib/utils';

export default function UserDashboardPage() {
  const { user, loading: authLoading, loginAsDemo } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'TICKETS' | 'ORDERS' | 'PROFILE'>('TICKETS');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch user tickets
    fetch(`/api/tickets?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then(async (res) => {
        if (res.success && res.data) {
          setTickets(res.data);

          // Generate QR Codes
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
  }, [user]);

  // Jika belum login
  if (!authLoading && !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Silakan Masuk Terlebih Dahulu
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Untuk mengakses dashboard pengguna dan melihat e-tiket yang telah Anda beli, silakan masuk ke akun Anda.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login?redirect=/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 hover:opacity-95 transition-all"
            >
              Masuk Sekarang
            </Link>
            <button
              type="button"
              onClick={() => loginAsDemo('USER')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all"
            >
              1-Klik Demo Login User
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeTickets = tickets.filter((t) => !t.isCheckedIn);
  const usedTickets = tickets.filter((t) => t.isCheckedIn);

  const filteredTickets = tickets.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.eventTitle?.toLowerCase().includes(q) ||
      t.ticketCode.toLowerCase().includes(q) ||
      t.attendeeName.toLowerCase().includes(q)
    );
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* 👤 Header Banner Profil Pengguna */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-2xl font-black text-white uppercase shadow-lg shadow-indigo-500/25 shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Halo, {user?.name}!
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Akun Terverifikasi
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
              <p className="text-[11px] text-indigo-400 font-semibold mt-1">
                Peran: {user?.role === 'ADMIN' ? 'Administrator Event' : 'Member Pengguna (Goers Pass)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
            >
              Pengaturan Profil
            </Link>
            <Link
              href="/explore"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
            >
              Beli Tiket Lagi
            </Link>
          </div>
        </div>

        {/* Mini Stats Bar */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-center">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium block">Total Tiket</span>
            <span className="text-lg sm:text-xl font-black text-white">{tickets.length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-pink-400 font-medium block">Tiket Siap Pakai</span>
            <span className="text-lg sm:text-xl font-black text-pink-300">{activeTickets.length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-emerald-400 font-medium block">Sudah Digunakan</span>
            <span className="text-lg sm:text-xl font-black text-emerald-300">{usedTickets.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs Nav */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8">
        <button
          onClick={() => setActiveTab('TICKETS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'TICKETS'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <TicketIcon className="w-4 h-4" />
          <span>E-Tiket Saya ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'PROFILE'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Informasi Profil</span>
        </button>
      </div>

      {/* 🎟️ TAB TIKET SAYA */}
      {activeTab === 'TICKETS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">Daftar Tiket Anda</h3>
              <p className="text-xs text-slate-400">
                Tunjukkan QR Code di pintu masuk saat hari H acara
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
              >
                <Printer className="w-4 h-4 text-indigo-400" />
                <span>Cetak Tiket</span>
              </button>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari kode tiket..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              Memuat tiket Anda...
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
                    {/* Header Strip */}
                    <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-indigo-400 font-bold tracking-wider">
                          {ticket.ticketCode}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-300 font-semibold">
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

                    {/* Ticket Body */}
                    <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
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
                            <span className="text-slate-500 block font-medium">Pemegang Tiket</span>
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
                            <span>Tercatat check-in pada {new Date(ticket.checkedInAt).toLocaleString('id-ID')}</span>
                          </div>
                        )}
                      </div>

                      {/* QR Box */}
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
                          SCAN DI GERBANG MASUK
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-3">
                <TicketIcon className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-white">Belum Memiliki Tiket</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
                Cari konser seru, wahana atraksi, atau festival dan dapatkan tiket resmi sekarang!
              </p>
              <Link
                href="/explore"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Jelajah Event Sekarang
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 👤 TAB PROFIL USER */}
      {activeTab === 'PROFILE' && (
        <div className="max-w-2xl space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-pink-400" />
              <span>Detail Informasi Akun</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Nama Lengkap</label>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold">
                  {user?.name}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Email Terdaftar</label>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Status Keanggotaan</label>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Goers Verified Member ({user?.role})</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/profile"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-block"
                >
                  Edit Data Lengkap Profil
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
