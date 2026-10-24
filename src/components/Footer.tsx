import React from 'react';
import Link from 'next/link';
import { Ticket, ShieldCheck, Zap, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-sm">
      {/* Upper Features Highlights */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Tiket Resmi & Terverifikasi</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Diterbitkan langsung dari promotor resmi dengan jaminan QR code valid untuk check-in.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">E-Tiket & Konfirmasi Instan</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Setelah pembayaran berhasil, tiket langsung tersedia di dashboard dan siap diunduh.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Metode Pembayaran Lengkap</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Mendukung QRIS instan, Virtual Account BCA, Mandiri, BRI, BNI, dan e-wallet.
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
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-sm">
                <Ticket className="w-4 h-4 transform -rotate-12" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Pass<span className="text-orange-500">Go</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Platform pemesanan tiket konser musik, festival, atraksi wahana, pameran seni, dan aktivitas hiburan terpercaya di Indonesia.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Jakarta & Bandung, Indonesia</span>
            </div>
          </div>

          {/* Col 2: Kategori Populer */}
          <div>
            <h5 className="font-semibold text-white mb-3 text-sm">Kategori Acara</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/explore?category=konser-musik" className="hover:text-orange-400 transition-colors">Konser Musik & Festival</Link></li>
              <li><Link href="/explore?category=atraksi-rekreasi" className="hover:text-orange-400 transition-colors">Atraksi & Theme Park (Dufan)</Link></li>
              <li><Link href="/explore?category=festival-budaya" className="hover:text-orange-400 transition-colors">Festival Kuliner & Budaya</Link></li>
              <li><Link href="/explore?category=olahraga" className="hover:text-orange-400 transition-colors">Olahraga & Lari Maraton</Link></li>
              <li><Link href="/explore?category=workshop-edukasi" className="hover:text-orange-400 transition-colors">Workshop & Konferensi</Link></li>
              <li><Link href="/explore?category=pameran-seni" className="hover:text-orange-400 transition-colors">Pameran & Galeri Seni</Link></li>
            </ul>
          </div>

          {/* Col 3: Untuk Penyelenggara / Organizer */}
          <div>
            <h5 className="font-semibold text-white mb-3 text-sm">Mitra & Penyelenggara</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/organizer/events/create" className="hover:text-orange-400 transition-colors">Pasang & Buat Event Baru</Link></li>
              <li><Link href="/organizer/scan" className="hover:text-orange-400 transition-colors">Onsite QR Scanner Check-in</Link></li>
              <li><Link href="/organizer" className="hover:text-orange-400 transition-colors">Dashboard Penjualan Tiket</Link></li>
              <li><Link href="/organizer" className="hover:text-orange-400 transition-colors">Manajemen Kategori & Kuota</Link></li>
            </ul>
          </div>

          {/* Col 4: Pembayaran & Bantuan */}
          <div>
            <h5 className="font-semibold text-white mb-3 text-sm">Metode Pembayaran</h5>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-300">QRIS</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-300">BCA Virtual Account</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-300">Mandiri VA</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-300">GoPay</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-300">OVO</span>
            </div>
            <h5 className="font-semibold text-white mb-2 text-sm">Layanan Bantuan</h5>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-orange-500" />
                <span>support@passgo.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-orange-500" />
                <span>+62 812-9900-8800 (WhatsApp Bantuan)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bottom */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 PassGo Indonesia. Platform pemesanan tiket resmi dan aman.</p>
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
