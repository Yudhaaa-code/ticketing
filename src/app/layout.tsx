import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GoersTicket - Beli Tiket Konser, Atraksi, & Event Terbaik di Indonesia',
  description:
    'Platform ticketing online terpercaya untuk tiket konser musik, Dufan Ancol, festival kuliner, pameran seni, workshop dan lomba lari maraton di Indonesia.',
  keywords: [
    'tiket konser',
    'tiket dufan',
    'goersapp',
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
    <html lang="id" className="dark scroll-smooth">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-pink-500 selection:text-white`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
