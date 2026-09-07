'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Search, 
  Clock, 
  User, 
  Ticket as TicketIcon,
  ShieldAlert,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Ticket } from '@/lib/types';
import { formatDateIndo } from '@/lib/utils';

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
    status: 'SUCCESS' | 'ALREADY_USED' | 'INVALID';
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

      const status = data.success
        ? 'SUCCESS'
        : data.message?.includes('sudah')
        ? 'ALREADY_USED'
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
    } catch (err: any) {
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
          <QrCode className="w-4 h-4" />
          <span>Onsite Gate Validation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Scanner & Validasi Tiket Onsite
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Peralatan panitia gerbang masuk acara untuk memvalidasi QR Code & nomor tiket pengunjung
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scanner Input & Status (Col 1 & 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Box Form Scan */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl">
            <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-indigo-400" />
              <span>Input Kode Tiket / Barcode Scanner</span>
            </h3>

            <form onSubmit={handleValidate} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  placeholder="Scan barcode atau ketik e.g. VIP-SW8829"
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-slate-950 border border-slate-700 text-base font-mono uppercase text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  autoFocus
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Contoh tiket demo:</span>
                  {sampleDemoCodes.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setTicketInput(code)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono text-xs transition-colors"
                    >
                      {code}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || !ticketInput.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-40"
                >
                  {loading ? 'Memvalidasi...' : 'Verifikasi Tiket'}
                </button>
              </div>
            </form>
          </div>

          {/* Validation Result Box */}
          {scanResult && (
            <div
              className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                scanResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    scanResult.success
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {scanResult.success ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <XCircle className="w-7 h-7" />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white">
                    {scanResult.success ? 'TIKET VALID - SILAKAN MASUK' : 'TIKET DITOLAK / TIDAK VALID'}
                  </h4>
                  <p className="text-sm mt-1 opacity-90">{scanResult.message}</p>

                  {scanResult.ticket && (
                    <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="opacity-60 block">Event:</span>
                        <span className="font-bold text-white text-sm">
                          {scanResult.ticket.eventTitle}
                        </span>
                      </div>
                      <div>
                        <span className="opacity-60 block">Kategori Tiket:</span>
                        <span className="font-bold text-white text-sm">
                          {scanResult.ticket.ticketTierName}
                        </span>
                      </div>
                      <div>
                        <span className="opacity-60 block">Nama Pemegang:</span>
                        <span className="font-bold text-white">
                          {scanResult.ticket.attendeeName}
                        </span>
                      </div>
                      <div>
                        <span className="opacity-60 block">Kode Unik:</span>
                        <span className="font-mono font-bold text-white">
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
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Riwayat Pemindaian Onsite</span>
            </h4>

            {history.length > 0 ? (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-white block">{h.code}</span>
                      {h.name && <span className="text-[11px] text-slate-400">{h.name}</span>}
                    </div>

                    <div className="text-right">
                      {h.status === 'SUCCESS' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          VALID
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400">
                          GAGAL
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 block mt-0.5">{h.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                Belum ada tiket yang dipindai sesi ini
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
