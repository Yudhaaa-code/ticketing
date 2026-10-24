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
  AlertCircle
} from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const { login, loginAsDemo } = useAuth();
  const isBuyerFlow = Boolean(redirectPath && redirectPath !== '/' && !redirectPath.startsWith('/organizer'));
  const [selectedRole, setSelectedRole] = useState<UserRole>(isBuyerFlow ? 'USER' : 'ADMIN');
  const [email, setEmail] = useState(isBuyerFlow ? 'budi.santoso@example.com' : 'admin@passgo.id');
  const [password, setPassword] = useState(isBuyerFlow ? 'user123' : 'admin123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleTab = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'ADMIN') {
      setEmail('admin@passgo.id');
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
    router.push('/organizer');
  };

  const handleQuickUser = () => {
    loginAsDemo('USER');
    router.push(redirectPath);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-orange-600 items-center justify-center text-white shadow-sm mb-2">
            <Ticket className="w-6 h-6 transform -rotate-12" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Masuk ke PassGo
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pilih jenis akun untuk melanjutkan akses platform
          </p>
        </div>

        {/* Form Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-md space-y-5">
          {isBuyerFlow && (
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-800 flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Silakan masuk untuk melanjutkan proses pemesanan tiket Anda.</span>
            </div>
          )}

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => handleRoleTab('ADMIN')}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                selectedRole === 'ADMIN'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span>Mitra / Organizer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTab('USER')}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                selectedRole === 'USER'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-slate-700" />
              <span>Pembeli Tiket</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block text-center uppercase tracking-wider">
              Akses Cepat Pengujian (1-Klik)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickAdmin}
                className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                <span>Akun Mitra</span>
              </button>

              <button
                type="button"
                onClick={handleQuickUser}
                className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-slate-700" />
                <span>Akun Pembeli</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500">
          Belum punya akun?{' '}
          <Link href="/register" className="text-orange-600 hover:underline font-semibold">
            Daftar Akun Baru
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-slate-500">Memuat halaman login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
