'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Ticket
} from 'lucide-react';
import { initialCategories } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';

export default function CreateEventPage() {
  const router = useRouter();
  const { isAdmin, loginAsDemo } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [categoryId, setCategoryId] = useState('cat-music');
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [venueName, setVenueName] = useState('');
  const [city, setCity] = useState('Jakarta');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [organizerPhone, setOrganizerPhone] = useState('');

  // Ticket Tiers State
  const [tiers, setTiers] = useState([
    { name: 'Early Bird Pass', price: 150000, quota: 200, maxPerOrder: 4, description: 'Tiket presale terbatas' },
    { name: 'Regular Entry', price: 250000, quota: 500, maxPerOrder: 4, description: 'Tiket masuk umum' },
  ]);

  const handleAddTier = () => {
    setTiers([
      ...tiers,
      { name: 'VIP Pass', price: 500000, quota: 100, maxPerOrder: 2, description: 'Akses khusus barisan depan' },
    ]);
  };

  const handleRemoveTier = (index: number) => {
    if (tiers.length <= 1) {
      setErrorMsg('Event wajib memiliki minimal 1 jenis tiket.');
      return;
    }
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const handleTierChange = (index: number, field: string, value: any) => {
    const next = [...tiers];
    next[index] = { ...next[index], [field]: value };
    setTiers(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title || !venueName || !city || !startDate) {
      setErrorMsg('Harap lengkapi kolom bertanda bintang (*)');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          tagline,
          categoryId,
          description: description || 'Event seru yang tidak boleh Anda lewatkan.',
          terms: terms || '1. Tiket tidak dapat di-refund.\n2. Wajib membawa identitas saat masuk.',
          bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&auto=format&fit=crop&q=80',
          venueName,
          city,
          address: address || venueName,
          startDate: new Date(startDate).toISOString(),
          organizerName: organizerName || 'Mitra Promotor',
          organizerPhone: organizerPhone || '0812-0000-0000',
          ticketTiers: tiers,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Gagal membuat event');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/events/${data.data.slug}`);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem saat mempublikasikan event');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center bg-slate-50 min-h-screen">
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4">
          <div className="w-14 h-14 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mx-auto">
            <Ticket className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Akses Terbatas: Hanya Akun Mitra Organizer</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Pembuatan event baru dan pengaturan penjualan tiket hanya dapat dilakukan oleh akun dengan hak akses <strong>Mitra Penyelenggara</strong>.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login?redirect=/organizer/events/create"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-orange-600 text-white font-bold text-xs shadow-sm hover:bg-orange-700 transition-all"
            >
              Masuk sebagai Mitra
            </Link>
            <button
              type="button"
              onClick={() => loginAsDemo('ADMIN')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold text-xs transition-all"
            >
              Uji Coba Cepat (Akun Mitra)
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <span>Portal Penyelenggara</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Buat & Daftarkan Event Baru
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Publikasikan event konser musik, atraksi, atau festival Anda secara instan
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Event berhasil dibuat! Mengarahkan ke halaman acara...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Informasi Utama */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <span>Informasi Pokok Event</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama / Judul Event *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Soundfest Jakarta 2026 / Java Jazz Festival"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kategori Event *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                >
                  {initialCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tagline Ringkas
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Contoh: Konser musik indie spektakuler"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                URL Gambar / Poster Banner
              </label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Biarkan kosong untuk menggunakan poster bawaan beresolusi tinggi
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Deskripsi Lengkap Acara
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan susunan acara, guest star (line up), dan informasi penting lainnya..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Jadwal & Lokasi */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <span>Jadwal & Lokasi Acara</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Waktu & Tanggal Mulai *
              </label>
              <input
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kota Penyelenggaraan *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
              >
                <option value="Jakarta">Jakarta</option>
                <option value="Bandung">Bandung</option>
                <option value="Tangerang">Tangerang</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Yogyakarta">Yogyakarta</option>
                <option value="Bali">Bali</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Venue / Tempat *
              </label>
              <input
                type="text"
                required
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="Contoh: Istora Senayan GBK / Grand Ballroom"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Manajemen Kategori Tiket */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span>Kategori & Kuota Tiket</span>
            </h3>

            <button
              type="button"
              onClick={handleAddTier}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold hover:bg-orange-600 hover:text-white transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Kategori</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-700">
                    Kategori #{idx + 1}
                  </span>
                  {tiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      aria-label="Hapus Kategori"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nama Tiket *
                    </label>
                    <input
                      type="text"
                      required
                      value={tier.name}
                      onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                      placeholder="e.g. VIP / Regular"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Harga (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={5000}
                      value={tier.price}
                      onChange={(e) => handleTierChange(idx, 'price', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Kuota Tiket *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={tier.quota}
                      onChange={(e) => handleTierChange(idx, 'quota', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Benefit / Fasilitas Kategori
                  </label>
                  <input
                    type="text"
                    value={tier.description}
                    onChange={(e) => handleTierChange(idx, 'description', e.target.value)}
                    placeholder="Contoh: Akses Gate A, Welcome Drink, Free Merchandise"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Mempublikasikan Event...</span>
            </>
          ) : (
            <>
              <Ticket className="w-5 h-5" />
              <span>Publikasikan Event Sekarang</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
