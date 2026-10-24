'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Minus, Plus, ArrowRight, AlertCircle, Lock } from 'lucide-react';
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
    // Jika belum login, langsung arahkan ke form login
    if (!user) {
      if (totalTickets > 0) {
        // Simpan tiket yang sudah dipilih agar setelah login langsung lanjut ke checkout
        const selectedItems = Object.entries(quantities)
          .filter(([, quantity]) => quantity > 0)
          .map(([ticketTierId, quantity]) => ({
            ticketTierId,
            quantity,
          }));

        sessionStorage.setItem(
          'checkout_data',
          JSON.stringify({
            eventId: event.id,
            items: selectedItems,
          })
        );
        router.push(`/login?redirect=${encodeURIComponent(`/checkout?event=${event.slug}`)}`);
      } else {
        // Jika belum memilih tiket, arahkan ke login dan kembali ke tiket event ini
        router.push(`/login?redirect=${encodeURIComponent(`/events/${event.slug}#tickets-section`)}`);
      }
      return;
    }

    // Jika sudah login tapi belum memilih tiket
    if (totalTickets === 0) {
      setErrorMsg('Pilih minimal 1 tiket untuk melanjutkan.');
      return;
    }

    const selectedItems = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([ticketTierId, quantity]) => ({
        ticketTierId,
        quantity,
      }));

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
    <div className="flex flex-col gap-5">
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Notice jika belum login */}
      {!user && (
        <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0 text-orange-600" />
            <span>Silakan login terlebih dahulu untuk melanjutkan pembelian tiket.</span>
          </div>
          <Link
            href={`/login?redirect=/events/${event.slug}`}
            className="px-3 py-1 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
          >
            Masuk
          </Link>
        </div>
      )}

      {/* List Tiket */}
      <div className="space-y-3.5">
        {event.ticketTiers.map((tier) => {
          const qty = quantities[tier.id] || 0;
          const remaining = tier.quota - tier.soldCount;
          const isSoldOut = remaining <= 0;

          return (
            <div
              key={tier.id}
              className={`p-5 rounded-xl border transition-all ${
                qty > 0
                  ? 'bg-orange-50/30 border-orange-400 ring-1 ring-orange-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              } ${isSoldOut ? 'opacity-60 bg-slate-50' : ''}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base sm:text-lg">
                      {tier.name}
                    </span>
                    {isSoldOut ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                        Habis
                      </span>
                    ) : remaining < 30 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        Tersisa {remaining}
                      </span>
                    ) : null}
                  </div>

                  {tier.description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {tier.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                    <span className="text-base font-extrabold text-slate-900">
                      {formatRupiah(tier.price)}
                    </span>
                    <span>• Maks {tier.maxPerOrder} tiket/transaksi</span>
                  </div>
                </div>

                {/* Counter Actions */}
                <div className="flex items-center justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {isSoldOut ? (
                    <span className="text-xs font-semibold text-slate-400">Tiket Habis</span>
                  ) : (
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleDecrement(tier.id)}
                        disabled={qty === 0}
                        className="w-8 h-8 rounded-md flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        aria-label="Kurang"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-8 text-center text-sm font-bold text-slate-900">
                        {qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleIncrement(tier)}
                        disabled={qty >= tier.maxPerOrder || qty >= remaining}
                        className="w-8 h-8 rounded-md flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-30 disabled:hover:bg-slate-200 transition-all shadow-xs"
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

      {/* Floating Bottom Bar for Checkout */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 font-medium">Total Pesanan ({totalTickets} tiket):</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {formatRupiah(totalPrice)}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={Boolean(user && totalTickets === 0)}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-sm disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {user ? (
            <>
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-orange-200" />
              <span>
                {totalTickets > 0
                  ? `Masuk untuk Beli Tiket (${totalTickets})`
                  : 'Masuk untuk Beli Tiket'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
