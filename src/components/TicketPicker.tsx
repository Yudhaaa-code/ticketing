'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Minus, Plus, Ticket, ShieldCheck, ArrowRight, AlertCircle, Lock, User } from 'lucide-react';
import { EventItem, TicketTier } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface TicketPickerProps {
  event: EventItem;
}

export default function TicketPicker({ event }: TicketPickerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleIncrement = (tier: TicketTier) => {
    setErrorMsg(null);
    const current = quantities[tier.id] || 0;
    const available = tier.quota - tier.soldCount;

    if (current >= tier.maxPerOrder) {
      setErrorMsg(`Maksimal ${tier.maxPerOrder} tiket per transaksi untuk kategori ${tier.name}.`);
      return;
    }
    if (current >= available) {
      setErrorMsg(`Sisa kuota hanya tersisa ${available} tiket.`);
      return;
    }

    setQuantities({
      ...quantities,
      [tier.id]: current + 1,
    });
  };

  const handleDecrement = (tierId: string) => {
    setErrorMsg(null);
    const current = quantities[tierId] || 0;
    if (current <= 1) {
      const next = { ...quantities };
      delete next[tierId];
      setQuantities(next);
    } else {
      setQuantities({
        ...quantities,
        [tierId]: current - 1,
      });
    }
  };

  // Hitung total tiket & total harga
  const totalTickets = Object.values(quantities).reduce((acc, q) => acc + q, 0);
  const totalPrice = event.ticketTiers.reduce((acc, tier) => {
    const qty = quantities[tier.id] || 0;
    return acc + qty * tier.price;
  }, 0);

  const handleCheckout = () => {
    if (totalTickets === 0) {
      setErrorMsg('Pilih minimal 1 tiket untuk melanjutkan.');
      return;
    }

    // 🔒 ATURAN WAJIB LOGIN SEBELUM MEMBELI TIKET
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // Siapkan item pesanan
    const selectedItems = Object.entries(quantities).map(([ticketTierId, quantity]) => ({
      ticketTierId,
      quantity,
    }));

    // Simpan data pemilihan sementara di sessionStorage untuk halaman checkout
    sessionStorage.setItem(
      'checkout_data',
      JSON.stringify({
        eventId: event.id,
        items: selectedItems,
      })
    );

    router.push(`/checkout?event=${event.slug}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 🔒 Notifikasi jika belum login */}
      {!user && (
        <div className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0 text-pink-400" />
            <span>Anda belum masuk. Silakan login untuk dapat melanjutkan pembelian tiket.</span>
          </div>
          <Link
            href={`/login?redirect=/events/${event.slug}`}
            className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 transition-colors"
          >
            Masuk
          </Link>
        </div>
      )}

      {/* List Tiket */}
      <div className="space-y-4">
        {event.ticketTiers.map((tier) => {
          const qty = quantities[tier.id] || 0;
          const remaining = tier.quota - tier.soldCount;
          const isSoldOut = remaining <= 0;

          return (
            <div
              key={tier.id}
              className={`p-5 rounded-2xl border transition-all ${
                qty > 0
                  ? 'bg-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-950/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              } ${isSoldOut ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base sm:text-lg">
                      {tier.name}
                    </span>
                    {isSoldOut ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Habis
                      </span>
                    ) : remaining < 30 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Tersisa {remaining}
                      </span>
                    ) : null}
                  </div>

                  {tier.description && (
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {tier.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                    <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
                      {formatRupiah(tier.price)}
                    </span>
                    <span>• Maks {tier.maxPerOrder} tiket/transaksi</span>
                  </div>
                </div>

                {/* Counter Actions */}
                <div className="flex items-center justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {isSoldOut ? (
                    <span className="text-xs font-semibold text-slate-500">Tiket Habis</span>
                  ) : (
                    <div className="flex items-center gap-2 bg-slate-950/80 rounded-xl border border-slate-800 p-1">
                      <button
                        type="button"
                        onClick={() => handleDecrement(tier.id)}
                        disabled={qty === 0}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        aria-label="Kurang"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-8 text-center text-sm font-bold text-white">
                        {qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleIncrement(tier)}
                        disabled={qty >= tier.maxPerOrder || qty >= remaining}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:hover:bg-slate-800 transition-colors"
                        aria-label="Tambah"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Sticky Bottom Bar for Checkout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/80 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="text-xs text-slate-400">Total Pembelian ({totalTickets} tiket):</div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {formatRupiah(totalPrice)}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={totalTickets === 0}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
        >
          {user ? (
            <>
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-pink-300" />
              <span>Masuk untuk Beli Tiket</span>
            </>
          )}
        </button>
      </div>

      {/* 🔒 Modal Wajib Login Pop-up */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7 text-pink-400" />
            </div>

            <h3 className="text-xl font-black text-white">Harus Masuk (Login) Terlebih Dahulu</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Untuk menjamin keamanan pemesanan dan agar e-tiket resmi dapat disimpan di akun Anda, Anda wajib login sebelum membeli tiket.
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href={`/login?redirect=/events/${event.slug}`}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all block"
              >
                Masuk ke Akun Sekarang
              </Link>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
