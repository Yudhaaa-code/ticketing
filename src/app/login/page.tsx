'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Ticket, 
  ShieldCheck, 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const { login, loginAsDemo, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [email, setEmail] = useState('admin@goersapp.id');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleTab = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'ADMIN') {
      setEmail('admin@goersapp.id');
      setPassword('admin123');
    } else {
      setEmail('budi.santoso@example.com');
      setPassword('user123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Harap masukkan email dan kata sandi.');
      return;
    }

    login(email, selectedRole);
    router.push(selectedRole === 'ADMIN' ? '/organizer' : redirectPath);
  };

  const handleQuickAdmin = () => {
    loginAsDemo('ADMIN');
    router.push('/organizer/events/create');
  };

  const handleQuickUser = () => {
    loginAsDemo('USER');
    router.push(redirectPath);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 items-center justify-center shadow-lg shadow-indigo-500/25 mb-2">
            <Ticket className="w-6 h-6 text-white transform -rotate-12" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Masuk ke GoersTicket
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Pilih jenis akun untuk melanjutkan akses platform
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => handleRoleTab('ADMIN')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              selectedRole === 'ADMIN'
                ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin / Organizer</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTab('USER')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              selectedRole === 'USER'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Pengguna (User)</span>
          </button>
        </div>

        {/* Box Notice Role */}
        <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
          selectedRole === 'ADMIN'
            ? 'bg-pink-500/10 border-pink-500/30 text-pink-200'
            : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
        }`}>
          {selectedRole === 'ADMIN' ? (
            <p>
              ✨ <strong>Mode Admin / Penyelenggara:</strong> Tombol <span className="underline font-bold text-white">"Buat Event"</span> (+ ikon pink) dan dashboard scanner akan aktif setelah Anda masuk.
            </p>
          ) : (
            <p>
              🎟️ <strong>Mode Pengguna / Pembeli:</strong> Akses penuh untuk menjelajah event, memesan tiket, dan melihat e-tiket saya. (Tombol "Buat Event" disembunyikan).
            </p>
          )}
        </div>

        {/* Form Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5 backdrop-blur-xl">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Akun
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Login Demo */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block text-center uppercase tracking-wider">
              Atau Uji Coba Cepat (1-Klik)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickAdmin}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-pink-500/40 text-pink-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                <span>Akun Admin</span>
              </button>

              <button
                type="button"
                onClick={handleQuickUser}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Akun User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500">
          Belum punya akun?{' '}
          <Link href="/register" className="text-indigo-400 hover:underline font-semibold">
            Daftar Akun Baru
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-slate-400">Memuat halaman login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
