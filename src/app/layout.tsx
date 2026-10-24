import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PassGo - Beli Tiket Konser, Atraksi, & Event Terbaik di Indonesia',
  description:
    'Platform tiket resmi terpercaya untuk konser musik, atraksi hiburan, festival kuliner, pameran seni, dan workshop di Indonesia.',
  keywords: [
    'tiket konser',
    'tiket dufan',
    'passgo',
    'tiket festival musik',
    'event jakarta',
    'event bandung',
    'beli tiket online',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-orange-500 selection:text-white`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
