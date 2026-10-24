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
  User, 
  ShieldCheck, 
  QrCode,
  Download,
  Clock,
  Lock,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Ticket } from '@/lib/types';
import { formatDateIndo, formatDateTimeIndo } from '@/lib/utils';

export default function UserDashboardPage() {
  const { user, loading: authLoading, loginAsDemo } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'TICKETS' | 'PROFILE'>('TICKETS');
  const [searchQuery, setSearchQuery] = useState('');
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  const loadUserTickets = async (email: string) => {
    try {
      const res = await fetch(`/api/tickets?email=${encodeURIComponent(email)}`);
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
    if (!user) {
      setLoading(false);
      return;
    }
    loadUserTickets(user.email);
  }, [user]);

  const handlePayPendingOrder = async (orderId: string) => {
    setPayingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/pay`, { method: 'POST' });
      const data = await res.json();
      if (data.success && user) {
        await loadUserTickets(user.email);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPayingOrderId(null);
    }
  };

  if (!authLoading && !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center bg-slate-50 min-h-screen">
        <div className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4">
          <div className="w-14 h-14 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mx-auto">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Masuk untuk Melihat E-Tiket Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Untuk mengakses dashboard pengguna dan mengunduh barcode tiket acara yang telah dibeli, silakan masuk ke akun Anda.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login?redirect=/dashboard"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Masuk Sekarang
            </Link>
            <button
              type="button"
              onClick={() => loginAsDemo('USER')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold text-xs transition-all"
            >
              Uji Coba Cepat (Akun Pembeli)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeTickets = tickets.filter((t) => t.orderStatus === 'PAID' && !t.isCheckedIn);
  const pendingTickets = tickets.filter((t) => t.orderStatus === 'PENDING');
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-slate-50 min-h-screen">
      {/* Header Banner Profil Pengguna */}
      <div className="relative rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-orange-600 flex items-center justify-center text-xl font-black text-white uppercase shadow-sm shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Halo, {user?.name}!
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Akun Terverifikasi
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              <p className="text-[11px] text-orange-600 font-semibold mt-1">
                Tipe Akun: {user?.role === 'ADMIN' ? 'Mitra Organizer' : 'Member Pembeli Tiket'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/profile"
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all border border-slate-200"
            >
              Pengaturan Profil
            </Link>
            <Link
              href="/explore"
              className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              Cari Event Lainnya
            </Link>
          </div>
        </div>

        {/* Mini Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-center">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Total Tiket</span>
            <span className="text-lg sm:text-xl font-black text-slate-900">{tickets.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
            <span className="text-[11px] text-orange-700 font-medium block">Siap Digunakan</span>
            <span className="text-lg sm:text-xl font-black text-orange-700">{activeTickets.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] text-amber-700 font-medium block">Belum Lunas</span>
            <span className="text-lg sm:text-xl font-black text-amber-700">{pendingTickets.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Sudah Check-in</span>
            <span className="text-lg sm:text-xl font-black text-slate-700">{usedTickets.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs Nav */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
        <button
          onClick={() => setActiveTab('TICKETS')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'TICKETS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TicketIcon className="w-4 h-4" />
          <span>E-Tiket Saya ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'PROFILE'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Informasi Akun</span>
        </button>
      </div>

      {/* TAB TIKET SAYA */}
      {activeTab === 'TICKETS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Daftar E-Tiket Anda</h3>
              <p className="text-xs text-slate-500">
                Tunjukkan QR Code berikut di pintu masuk saat hari pelaksanaan acara
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold transition-all shadow-xs"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Cetak Tiket</span>
              </button>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari tiket..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 shadow-xs"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              Memuat tiket Anda...
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
                    {/* Header Strip */}
                    <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-orange-600 font-bold tracking-wider">
                          {ticket.ticketCode}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-700 font-semibold">
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

                    {/* Ticket Body */}
                    <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
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
                            <span className="text-slate-500 block font-medium">Pemegang Tiket</span>
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
                            <span>Tercatat check-in pada {new Date(ticket.checkedInAt).toLocaleString('id-ID')}</span>
                          </div>
                        )}
                      </div>

                      {/* QR Box */}
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
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mx-auto mb-3">
                <TicketIcon className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Belum Memiliki Tiket</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
                Temukan konser favorit atau atraksi hiburan seru dan pesan tiket resmi Anda sekarang.
              </p>
              <Link
                href="/explore"
                className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                Jelajah Event Sekarang
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB PROFIL USER */}
      {activeTab === 'PROFILE' && (
        <div className="max-w-2xl space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" />
              <span>Detail Informasi Akun</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-500 font-medium block mb-1">Nama Lengkap</label>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold">
                  {user?.name}
                </div>
              </div>

              <div>
                <label className="text-slate-500 font-medium block mb-1">Email Terdaftar</label>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="text-slate-500 font-medium block mb-1">Status Keanggotaan</label>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Member Terverifikasi ({user?.role})</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/profile"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold inline-block shadow-sm"
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
