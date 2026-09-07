'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Ticket, 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  Sparkles,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventItem, PaymentMethod } from '@/lib/types';
import { formatRupiah, formatDateIndo } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventSlug = searchParams.get('event');
  const { user, loginAsDemo } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<{ ticketTierId: string; quantity: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('081298765432');
  const [customerIdCard, setCustomerIdCard] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto fill when user changes
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
    }
  }, [user]);

  // Modal payment simulation state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  useEffect(() => {
    // Load data from sessionStorage
    const stored = sessionStorage.getItem('checkout_data');
    if (!stored) {
      router.push(eventSlug ? `/events/${eventSlug}` : '/explore');
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setSelectedItems(parsed.items || []);

      // Fetch event detail
      fetch(`/api/events/${eventSlug || parsed.eventId}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setEvent(res.data);
          } else {
            // Fallback fetch all
            fetch('/api/events')
              .then((r) => r.json())
              .then((r2) => {
                const found = r2.data?.find((e: EventItem) => e.id === parsed.eventId || e.slug === eventSlug);
                if (found) setEvent(found);
              });
          }
        })
        .finally(() => setLoading(false));
    } catch {
      router.push('/explore');
    }
  }, [eventSlug, router]);

  if (loading || !event) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="text-sm">Menyiapkan halaman checkout...</span>
      </div>
    );
  }

  // Calculate totals
  const itemsWithDetails = selectedItems.map((item) => {
    const tier = event.ticketTiers.find((t) => t.id === item.ticketTierId);
    return {
      ...item,
      tier,
      subtotal: (tier?.price || 0) * item.quantity,
    };
  });

  const subtotal = itemsWithDetails.reduce((acc, it) => acc + it.subtotal, 0);
  const platformFee = 5000;
  const totalAmount = subtotal + platformFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName || !customerEmail || !customerPhone) {
      setErrorMsg('Harap lengkapi Nama, Email, dan Nomor WhatsApp Anda.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          customerName,
          customerEmail,
          customerPhone,
          customerIdCard,
          paymentMethod,
          items: selectedItems,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Gagal memproses order.');
      }

      setCreatedOrder(data.data);
      setShowPaymentModal(true);

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishPayment = () => {
    // Clear session storage
    sessionStorage.removeItem('checkout_data');
    router.push('/dashboard');
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-pink-400 mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Wajib Masuk untuk Membeli Tiket
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Anda harus masuk ke akun Anda terlebih dahulu agar e-tiket resmi dapat diterbitkan dan tersimpan di dompet tiket akun Anda.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/login?redirect=/checkout?event=${event.slug}`}
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Event</span>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Checkout & Pembayaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Lengkapi data pemesan dan pilih metode pembayaran favorit Anda
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Transaksi Aman & Terenkripsi</span>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Pemesanan (Col 1 & 2) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-2 space-y-6">
          {/* Card Data Pemesan */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                1
              </span>
              <span>Data Kontak Pemesan</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nama Lengkap (sesuai KTP/SIM) *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Penerima Tiket *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="budi@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nomor WhatsApp / HP *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nomor NIK / KTP (Opsional)
                </label>
                <input
                  type="text"
                  value={customerIdCard}
                  onChange={(e) => setCustomerIdCard(e.target.value)}
                  placeholder="3171012304950001"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Card Metode Pembayaran */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                2
              </span>
              <span>Pilih Metode Pembayaran</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                {
                  id: 'QRIS',
                  name: 'QRIS (Semua Pembayaran)',
                  desc: 'BCA, Mandiri, GoPay, OVO, Dana, ShopeePay',
                  badge: 'Paling Populer',
                  icon: QrCode,
                },
                {
                  id: 'BCA_VA',
                  name: 'BCA Virtual Account',
                  desc: 'Konfirmasi otomatis 24 jam',
                  icon: CreditCard,
                },
                {
                  id: 'MANDIRI_VA',
                  name: 'Mandiri Virtual Account',
                  desc: 'Livin by Mandiri & ATM',
                  icon: CreditCard,
                },
                {
                  id: 'GOPAY',
                  name: 'GoPay / GoPay Coins',
                  desc: 'Instan lewat aplikasi Gojek',
                  icon: Sparkles,
                },
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;

                return (
                  <label
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-600/10 border-indigo-500 shadow-md shadow-indigo-950/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{method.name}</span>
                          {method.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-pink-500 text-white">
                              {method.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 block mt-0.5">{method.desc}</span>
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 ${
                        isSelected ? 'border-indigo-500 bg-indigo-600' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:opacity-95 text-white font-bold text-base shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memproses Pesanan...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Bayar Sekarang ({formatRupiah(totalAmount)})</span>
              </>
            )}
          </button>
        </form>

        {/* Ringkasan Pesanan (Col 3) */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base">Ringkasan Pesanan</h3>

            {/* Event Header mini */}
            <div className="flex gap-3 pb-4 border-b border-slate-800">
              <img
                src={event.thumbnailUrl || event.bannerUrl}
                alt={event.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white line-clamp-2">{event.title}</h4>
                <p className="text-xs text-pink-400 mt-1">{formatDateIndo(event.startDate)}</p>
                <p className="text-xs text-slate-400 line-clamp-1">{event.venueName}, {event.city}</p>
              </div>
            </div>

            {/* Tiket list */}
            <div className="space-y-2 text-xs">
              {itemsWithDetails.map((it) => (
                <div key={it.ticketTierId} className="flex justify-between items-center text-slate-300">
                  <div>
                    <span className="font-semibold text-white">{it.tier?.name}</span>
                    <span className="text-slate-500 ml-1">x{it.quantity}</span>
                  </div>
                  <span className="font-medium text-white">{formatRupiah(it.subtotal)}</span>
                </div>
              ))}
            </div>

            {/* Fee Breakdown */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal Tiket</span>
                <span className="text-white">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Layanan Platform</span>
                <span className="text-white">{formatRupiah(platformFee)}</span>
              </div>
            </div>

            {/* Total Grand */}
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Total Tagihan</span>
                <span className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
                  {formatRupiah(totalAmount)}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-semibold text-slate-300">
                Termasuk Pajak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 💳 MODAL SIMULASI PEMBAYARAN QRIS / VA */}
      {showPaymentModal && createdOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-6 text-center">
            {/* Header Modal */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Pesanan Berhasil Dibuat!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Order ID: <span className="font-mono text-indigo-400 font-bold">{createdOrder.orderNumber}</span>
              </p>
            </div>

            {/* QRIS / VA Display */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Metode: {createdOrder.paymentMethod}</span>
                <span className="text-pink-400 flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5" /> 23:59:59
                </span>
              </div>

              {/* QR Code Canvas Mock */}
              <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl flex flex-col items-center justify-center shadow-inner">
                <QrCode className="w-36 h-36 text-slate-950" />
                <span className="text-[10px] font-mono text-slate-700 font-bold tracking-widest uppercase">
                  NMID: ID10202688991
                </span>
              </div>

              <div className="text-center">
                <span className="text-xs text-slate-400 block">Total Pembayaran</span>
                <span className="text-xl font-extrabold text-white">
                  {formatRupiah(createdOrder.totalAmount)}
                </span>
              </div>
            </div>

            {/* Tombol Selesai Pembayaran */}
            <button
              type="button"
              onClick={handleFinishPayment}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Lihat E-Tiket di Dashboard Saya</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-slate-400">Memuat checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
