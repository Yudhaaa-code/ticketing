import React from 'react';
import Link from 'next/link';
import { Ticket, ShieldCheck, Zap, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      {/* Upper Features Highlights */}
      <div className="border-b border-slate-850 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">100% Tiket Resmi & Terverifikasi</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Semua tiket diterbitkan langsung dari promotor resmi dengan jaminan barcode anti-duplikasi.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Konfirmasi & E-Tiket Instan</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Selesai bayar, e-tiket dengan QR Code langsung terbit dan dapat diunduh tanpa antre.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Metode Pembayaran Terlengkap</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Mendukung QRIS (semua e-wallet & m-banking), Transfer Virtual Account BCA, Mandiri, BRI, BNI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-md">
                <Ticket className="w-5 h-5 text-white transform -rotate-12" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                goers<span className="text-pink-500">ticket</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Platform penemuan hiburan dan solusi manajemen tiket event nomor satu di Indonesia. Rasakan kemudahan mencari konser musik, festival, atraksi wahana, dan aktivitas menarik setiap hari.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Jakarta & Bandung, Indonesia</span>
            </div>
          </div>

          {/* Col 2: Kategori Populer */}
          <div>
            <h5 className="font-semibold text-white mb-3 text-sm">Kategori Pilihan</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/explore?category=konser-musik" className="hover:text-indigo-400 transition-colors">Konser & Live Music</Link></li>
              <li><Link href="/explore?category=atraksi-rekreasi" className="hover:text-indigo-400 transition-colors">Atraksi & Theme Park (Dufan)</Link></li>
              <li><Link href="/explore?category=festival-budaya" className="hover:text-indigo-400 transition-colors">Festival & Culinary Expo</Link></li>
              <li><Link href="/explore?category=olahraga" className="hover:text-indigo-400 transition-colors">Olahraga & Marathon Run</Link></li>
              <li><Link href="/explore?category=workshop-edukasi" className="hover:text-indigo-400 transition-colors">Workshop & Tech Summit</Link></li>
              <li><Link href="/explore?category=pameran-seni" className="hover:text-indigo-400 transition-colors">Pameran & Galeri Seni</Link></li>
            </ul>
          </div>

          {/* Col 3: Untuk Penyelenggara / Organizer */}
          <div>
            <h5 className="font-semibold text-white mb-3 text-sm">Untuk Event Organizer</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/organizer/events/create" className="hover:text-indigo-400 transition-colors">Buat & Pasang Event</Link></li>
              <li><Link href="/organizer/scan" className="hover:text-indigo-400 transition-colors">Onsite QR Scanner Check-in</Link></li>
              <li><Link href="/organizer" className="hover:text-indigo-400 transition-colors">Dashboard Penjualan Tiket</Link></li>
              <li><span className="text-slate-500 cursor-not-allowed">Goers Experience Manager (GEM)</span></li>
              <li><span className="text-slate-500 cursor-not-allowed">Virtual Waiting Room Anti-War</span></li>
            </ul>
          </div>

          {/* Col 4: Pembayaran & Bantuan */}
          <div>
            <h5 className="font-semibold text-white mb-3 text-sm">Pembayaran Aman</h5>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">QRIS</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">BCA Virtual Account</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">Mandiri VA</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">GoPay</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">OVO</span>
            </div>
            <h5 className="font-semibold text-white mb-2 text-sm">Bantuan & Hubungi Kami</h5>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-pink-400" />
                <span>support@goersticket.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-pink-400" />
                <span>+62 812-9900-8800 (WhatsApp)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bottom */}
        <div className="pt-8 mt-8 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 GoersTicket Indonesia. Terinspirasi oleh GoersApp. Dibuat dengan React & Next.js App Router & PostgreSQL.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Syarat & Ketentuan</span>
            <span className="hover:text-slate-400 cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-slate-400 cursor-pointer">Panduan Pengembalian</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
