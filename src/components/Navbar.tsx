'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Ticket, 
  Search, 
  PlusCircle, 
  Menu, 
  X, 
  Compass, 
  QrCode,
  Sparkles,
  User,
  LogOut,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  UserCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  // Tombol navigasi utama: Hapus 'Tiket Saya' dari header atas
  const navLinks = [
    { name: 'Jelajah Event', href: '/explore', icon: Compass },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Scan Tiket', href: '/organizer/scan', icon: QrCode });
    navLinks.push({ name: 'Dashboard Mitra', href: '/organizer', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Ticket className="w-5 h-5 text-white transform -rotate-12" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 font-black text-xl tracking-tight text-white">
                  <span>goers</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-400">
                    ticket
                  </span>
                </div>
                <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold -mt-1">
                  Experience More
                </span>
              </div>
            </Link>

            {/* Desktop Navigation (Tanpa tombol Tiket Saya di atas) */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* 🎯 BUTTON BUAT EVENT: HANYA MUNCUL DI LOGIN ADMIN */}
            {isAdmin && (
              <Link
                href="/organizer/events/create"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-200 hover:text-white bg-slate-900 border border-slate-700/80 hover:border-slate-500 transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4 text-pink-500" />
                <span className="font-semibold">Buat Event</span>
              </Link>
            )}

            <Link
              href="/explore"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:opacity-95 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Beli Tiket</span>
            </Link>

            {/* Auth Profile / Login Button */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white max-w-[110px] truncate">
                      {user.name}
                    </span>
                    <span className={`text-[10px] font-semibold ${isAdmin ? 'text-pink-400' : 'text-indigo-400'}`}>
                      {isAdmin ? 'Admin / Mitra' : 'User Member'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu Pengguna & Profil */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 backdrop-blur-xl">
                    <div className="p-3 border-b border-slate-800 text-xs">
                      <p className="font-bold text-white truncate">{user.name}</p>
                      <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                      <div className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {user.role}
                      </div>
                    </div>

                    <div className="py-1 text-xs space-y-1">
                      {/* Menu Dashboard User & Tiket */}
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                        <span>Dashboard & Tiket Saya</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <UserCircle className="w-4 h-4 text-pink-400" />
                        <span>Profil Pengguna</span>
                      </Link>

                      {isAdmin && (
                        <>
                          <div className="my-1 border-t border-slate-800" />
                          <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Menu Penyelenggara
                          </div>
                          <Link
                            href="/organizer"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-indigo-400" />
                            <span>Dashboard Organizer</span>
                          </Link>
                          <Link
                            href="/organizer/events/create"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <PlusCircle className="w-4 h-4 text-pink-500" />
                            <span>Buat Event Baru</span>
                          </Link>
                          <Link
                            href="/organizer/scan"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <QrCode className="w-4 h-4 text-emerald-400" />
                            <span>Scanner Onsite</span>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar (Logout)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <User className="w-4 h-4 text-indigo-400" />
                <span>Masuk</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <Link
                href="/dashboard"
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm"
              >
                {user.name.charAt(0)}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 text-xs font-semibold"
              >
                Masuk
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {user && (
            <div className="p-3 mb-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isAdmin ? 'bg-pink-500/20 text-pink-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                {user.role}
              </span>
            </div>
          )}

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {user && (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-slate-900"
              >
                <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                <span>Dashboard & Tiket Saya</span>
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-slate-900"
              >
                <UserCircle className="w-5 h-5 text-pink-400" />
                <span>Profil Pengguna</span>
              </Link>
            </>
          )}

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            {isAdmin && (
              <Link
                href="/organizer/events/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-200 bg-slate-900 border border-slate-800"
              >
                <PlusCircle className="w-4 h-4 text-pink-500" />
                <span>Buat Event (Admin)</span>
              </Link>
            )}

            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-pink-600 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Jelajah & Beli Tiket</span>
            </Link>

            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-slate-900 border border-slate-800 mt-2"
              >
                <User className="w-4 h-4" />
                <span>Masuk ke Akun</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
