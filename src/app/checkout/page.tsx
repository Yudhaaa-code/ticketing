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
  Lock,
  Wallet
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

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
    }
  }, [user, customerName, customerEmail]);

  // Modal payment simulation state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('checkout_data');
    if (!stored) {
      router.push(eventSlug ? `/events/${eventSlug}` : '/explore');
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setSelectedItems(parsed.items || []);

      fetch(`/api/events/${eventSlug || parsed.eventId}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setEvent(res.data);
          } else {
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-3 bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        <span className="text-sm">Menyiapkan halaman pembayaran...</span>
      </div>
    );
  }

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
      setIsPaid(false);
      setShowPaymentModal(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem saat memproses transaksi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!createdOrder) return;
    setPaying(true);
    try {
      const res = await fetch(`/api/orders/${createdOrder.id}/pay`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setIsPaid(true);
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPaying(false);
    }
  };

  const handleFinishPayment = () => {
    sessionStorage.removeItem('checkout_data');
    router.push('/dashboard');
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center bg-slate-50 min-h-screen">
        <div className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4">
          <div className="w-14 h-14 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Masuk untuk Melanjutkan Pembayaran
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            E-tiket resmi akan disimpan ke akun terdaftar Anda agar aman dan mudah diakses saat check-in.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/login?redirect=/checkout?event=${event.slug}`}
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-slate-50 min-h-screen">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Event</span>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Checkout & Pembayaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lengkapi data pemesan dan pilih metode pembayaran resmi Anda
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Pembayaran Aman & Terenkripsi</span>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Pemesanan (Col 1 & 2) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-2 space-y-6">
          {/* Card Data Pemesan */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>Data Kontak Pemesan</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap (sesuai KTP/Identitas) *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Penerima Tiket *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="budi@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor WhatsApp / HP Aktif *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor NIK / KTP (Opsional)
                </label>
                <input
                  type="text"
                  value={customerIdCard}
                  onChange={(e) => setCustomerIdCard(e.target.value)}
                  placeholder="3171012304950001"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card Metode Pembayaran */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>Pilih Metode Pembayaran</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                {
                  id: 'QRIS',
                  name: 'QRIS (Semua Pembayaran)',
                  desc: 'BCA, Mandiri, GoPay, OVO, Dana, ShopeePay',
                  badge: 'Paling Praktis',
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
                  icon: Wallet,
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
                        ? 'bg-orange-50/40 border-orange-500 ring-1 ring-orange-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{method.name}</span>
                          {method.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
                              {method.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 block mt-0.5">{method.desc}</span>
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 ${
                        isSelected ? 'border-orange-600 bg-orange-600' : 'border-slate-300'
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
            className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Ringkasan Pesanan</h3>

            {/* Event Header mini */}
            <div className="flex gap-3 pb-4 border-b border-slate-100">
              <img
                src={event.thumbnailUrl || event.bannerUrl}
                alt={event.title}
                className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{event.title}</h4>
                <p className="text-xs text-orange-600 font-semibold mt-1">{formatDateIndo(event.startDate)}</p>
                <p className="text-xs text-slate-500 line-clamp-1">{event.venueName}, {event.city}</p>
              </div>
            </div>

            {/* Tiket list */}
            <div className="space-y-2 text-xs">
              {itemsWithDetails.map((it) => (
                <div key={it.ticketTierId} className="flex justify-between items-center text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-900">{it.tier?.name}</span>
                    <span className="text-slate-500 ml-1">x{it.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">{formatRupiah(it.subtotal)}</span>
                </div>
              ))}
            </div>

            {/* Fee Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal Tiket</span>
                <span className="text-slate-900 font-semibold">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Layanan Platform</span>
                <span className="text-slate-900 font-semibold">{formatRupiah(platformFee)}</span>
              </div>
            </div>

            {/* Total Grand */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-500 block font-medium">Total Tagihan</span>
                <span className="text-xl font-black text-slate-900">
                  {formatRupiah(totalAmount)}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-100 text-[11px] font-semibold text-slate-700">
                Termasuk Pajak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL SIMULASI PEMBAYARAN QRIS / VA */}
      {showPaymentModal && createdOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-5 text-center">
            {/* Header Modal */}
            <div className="flex flex-col items-center">
              {isPaid ? (
                <>
                  <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Pembayaran Berhasil!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    E-Tiket resmi Anda telah aktif dan siap digunakan di pintu masuk.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-3">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Menunggu Pembayaran</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Nomor Pesanan: <span className="font-mono text-orange-600 font-bold">{createdOrder.orderNumber}</span>
                  </p>
                </>
              )}
            </div>

            {!isPaid ? (
              <>
                {/* QRIS / VA Display */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Metode: {createdOrder.paymentMethod}</span>
                    <span className="text-amber-700 flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5" /> 23:59:59
                    </span>
                  </div>

                  {/* QR Code Canvas Mock */}
                  <div className="w-44 h-44 mx-auto bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center shadow-xs">
                    <QrCode className="w-32 h-32 text-slate-900" />
                    <span className="text-[10px] font-mono text-slate-500 font-bold tracking-wider uppercase mt-1">
                      NMID: ID10202688991
                    </span>
                  </div>

                  <div className="text-center pt-1">
                    <span className="text-xs text-slate-500 block">Total Tagihan</span>
                    <span className="text-xl font-black text-slate-900">
                      {formatRupiah(createdOrder.totalAmount)}
                    </span>
                  </div>

                  <p className="text-[11px] text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200 leading-tight">
                    Perhatian: Tiket tidak dapat digunakan untuk masuk ke venue sebelum pembayaran dikonfirmasi lunas.
                  </p>
                </div>

                {/* Tombol Aksi Pembayaran */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={paying}
                    className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {paying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                    <span>{paying ? 'Memverifikasi...' : 'Konfirmasi Pembayaran (Simulasi Lunas)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinishPayment}
                    className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
                  >
                    Bayar Nanti (Cek Status di Dashboard)
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinishPayment}
                  className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Buka E-Tiket Aktif Saya</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-slate-500 bg-slate-50">Memuat checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
