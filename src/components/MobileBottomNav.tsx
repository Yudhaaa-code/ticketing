'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Ticket, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    {
      name: 'Beranda',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      name: 'Jelajah',
      href: '/explore',
      icon: Compass,
      isActive: pathname.startsWith('/explore'),
    },
    {
      name: 'Tiket Saya',
      href: user ? '/dashboard' : '/my-tickets',
      icon: Ticket,
      isActive: pathname === '/my-tickets' || pathname === '/dashboard',
    },
    {
      name: user ? 'Akun' : 'Masuk',
      href: user ? '/profile' : '/login',
      icon: User,
      isActive: pathname === '/profile' || pathname === '/login' || pathname === '/register',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${
                item.isActive
                  ? 'text-orange-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${item.isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
