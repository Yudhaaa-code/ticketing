'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Search, 
  Clock
} from 'lucide-react';
import { Ticket } from '@/lib/types';

export default function TicketScannerPage() {
  const [ticketInput, setTicketInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    ticket?: Ticket;
  } | null>(null);

  const [history, setHistory] = useState<{
    code: string;
    status: 'SUCCESS' | 'ALREADY_USED' | 'UNPAID' | 'INVALID';
    time: string;
    name?: string;
  }[]>([]);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    setLoading(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/tickets/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketCode: ticketInput.trim() }),
      });

      const data = await res.json();
      setScanResult(data);

      const status: 'SUCCESS' | 'ALREADY_USED' | 'UNPAID' | 'INVALID' = data.success
        ? 'SUCCESS'
        : data.message?.includes('sudah')
        ? 'ALREADY_USED'
        : data.message?.includes('belum lunas') || data.message?.includes('Menunggu Pembayaran')
        ? 'UNPAID'
        : 'INVALID';

      setHistory((prev) => [
        {
          code: ticketInput.trim().toUpperCase(),
          status,
          time: new Date().toLocaleTimeString('id-ID'),
          name: data.ticket?.attendeeName,
        },
        ...prev,
      ]);

      if (data.success) {
        setTicketInput('');
      }
    } catch {
      setScanResult({
        success: false,
        message: 'Gagal menghubungi server validasi.',
      });
    } finally {
      setLoading(false);
    }
  };

  const sampleDemoCodes = ['VIP-SW8829', 'REG-DF1142'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-slate-50 min-h-screen">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
          <QrCode className="w-4 h-4" />
          <span>Validasi Gerbang Onsite</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Scanner & Validasi Tiket Onsite
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Validasi tiket pengunjung dengan kode unik atau QR Code saat check-in gerbang acara
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scanner Input & Status (Col 1 & 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Box Form Scan */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-orange-600" />
              <span>Input Kode Tiket Pengunjung</span>
            </h3>

            <form onSubmit={handleValidate} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  placeholder="Ketik atau scan kode e.g. VIP-SW8829"
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-slate-50 border border-slate-200 text-base font-mono uppercase text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                  autoFocus
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Contoh tiket:</span>
                  {sampleDemoCodes.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setTicketInput(code)}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs transition-colors border border-slate-200"
                    >
                      {code}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || !ticketInput.trim()}
                  className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-40"
                >
                  {loading ? 'Memvalidasi...' : 'Verifikasi Tiket'}
                </button>
              </div>
            </form>
          </div>

          {/* Validation Result Box */}
          {scanResult && (
            <div
              className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                scanResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    scanResult.success
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {scanResult.success ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <XCircle className="w-7 h-7" />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="text-lg font-bold text-slate-900">
                    {scanResult.success ? 'TIKET VALID — SILAKAN MASUK' : 'TIKET DITOLAK / TIDAK VALID'}
                  </h4>
                  <p className="text-sm mt-1 text-slate-700">{scanResult.message}</p>

                  {scanResult.ticket && (
                    <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">Event:</span>
                        <span className="font-bold text-slate-900 text-sm">
                          {scanResult.ticket.eventTitle}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Kategori Tiket:</span>
                        <span className="font-bold text-slate-900 text-sm">
                          {scanResult.ticket.ticketTierName}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Nama Pemegang:</span>
                        <span className="font-bold text-slate-900">
                          {scanResult.ticket.attendeeName}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Kode Unik:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {scanResult.ticket.ticketCode}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scan Log History (Col 3) */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Riwayat Pemindaian Sesi Ini</span>
            </h4>

            {history.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-900 block">{h.code}</span>
                      {h.name && <span className="text-[11px] text-slate-500">{h.name}</span>}
                    </div>

                    <div className="text-right">
                      {h.status === 'SUCCESS' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          VALID
                        </span>
                      ) : h.status === 'UNPAID' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          BELUM LUNAS
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          GAGAL
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 block mt-0.5">{h.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Belum ada tiket yang dipindai sesi ini
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
