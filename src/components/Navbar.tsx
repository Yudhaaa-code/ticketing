'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Ticket, 
  PlusCircle, 
  Menu, 
  X, 
  Compass, 
  QrCode,
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

  const navLinks = [
    { name: 'Jelajah Event', href: '/explore', icon: Compass },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Scan Tiket', href: '/organizer/scan', icon: QrCode });
    navLinks.push({ name: 'Dashboard Mitra', href: '/organizer', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-sm group-hover:bg-orange-700 transition-colors">
                <Ticket className="w-5 h-5 transform -rotate-12" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center font-extrabold text-xl tracking-tight text-slate-900">
                  <span>Pass</span>
                  <span className="text-orange-600">Go</span>
                </div>
                <span className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold -mt-1">
                  Tiket Event & Hiburan
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-50 text-orange-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/organizer/events/create"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all"
              >
                <PlusCircle className="w-4 h-4 text-orange-600" />
                <span>Buat Event</span>
              </Link>
            )}

            <Link
              href="/explore"
              className="flex items-center gap-2 px-4.5 py-2 rounded-lg text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 shadow-sm transition-all"
            >
              <Ticket className="w-4 h-4" />
              <span>Cari Tiket</span>
            </Link>

            {/* Auth Profile / Login Button */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 max-w-[110px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {isAdmin ? 'Mitra Event' : 'Member'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50">
                    <div className="p-3 border-b border-slate-100 text-xs">
                      <p className="font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-slate-500 text-[11px] truncate">{user.email}</p>
                      <div className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                        {user.role}
                      </div>
                    </div>

                    <div className="py-1 text-xs space-y-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        <span>Dashboard & Tiket Saya</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        <UserCircle className="w-4 h-4 text-slate-500" />
                        <span>Profil Pengguna</span>
                      </Link>

                      {isAdmin && (
                        <>
                          <div className="my-1 border-t border-slate-100" />
                          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Menu Penyelenggara
                          </div>
                          <Link
                            href="/organizer"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-slate-500" />
                            <span>Dashboard Organizer</span>
                          </Link>
                          <Link
                            href="/organizer/events/create"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                          >
                            <PlusCircle className="w-4 h-4 text-orange-600" />
                            <span>Buat Event Baru</span>
                          </Link>
                          <Link
                            href="/organizer/scan"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                          >
                            <QrCode className="w-4 h-4 text-emerald-600" />
                            <span>Scanner Onsite</span>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
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
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                <User className="w-4 h-4 text-slate-600" />
                <span>Masuk</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <Link
                href="/dashboard"
                className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm"
              >
                {user.name.charAt(0)}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold"
              >
                Masuk
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {user && (
            <div className="p-3 mb-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-orange-50 text-orange-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-500" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {user && (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                <span>Dashboard & Tiket Saya</span>
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <UserCircle className="w-4 h-4 text-slate-500" />
                <span>Profil Pengguna</span>
              </Link>
            </>
          )}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isAdmin && (
              <Link
                href="/organizer/events/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-800 bg-slate-100 border border-slate-200"
              >
                <PlusCircle className="w-4 h-4 text-orange-600" />
                <span>Buat Event (Admin)</span>
              </Link>
            )}

            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-orange-600 shadow-sm"
            >
              <Ticket className="w-4 h-4" />
              <span>Jelajah & Beli Tiket</span>
            </Link>

            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 mt-2"
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
