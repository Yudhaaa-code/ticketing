# 🎟️ GoersTicket - Platform Ticketing Event (GoersApp Clone)

Platform ticketing event terintegrasi yang terinspirasi oleh **[GoersApp](https://www.goersapp.com/)**, dibangun dengan arsitektur modern **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, **Prisma ORM**, dan **PostgreSQL**.

---

## ✨ Fitur Utama

### 🌐 Pengguna / Pembeli Tiket:
- **Homepage Interaktif**: Hero section, pencarian instan (nama event & kota), filter kategori berikonik, highlight event pilihan, dan event trending.
- **Jelajah Event (`/explore`)**: Filter pencarian real-time berdasarkan kata kunci, kategori (*Konser & Musik*, *Atraksi & Rekreasi*, *Festival*, *Olahraga*, *Workshop*, *Pameran Seni*), dan kota.
- **Detail Event (`/events/[slug]`)**: Foto banner, informasi tanggal, lokasi venue & link Google Maps, deskripsi acara, syarat & ketentuan, dan **Ticket Tier Selection** interaktif dengan kuota dinamis.
- **Checkout Cerdas (`/checkout`)**: Form pemesanan data kontak (Nama, Email, WhatsApp, NIK), kalkulasi biaya tiket + platform fee, dan pemilihan metode pembayaran Indonesia (**QRIS**, **BCA VA**, **Mandiri VA**, **GoPay**).
- **Simulasi Pembayaran QRIS**: Modal pop-up dengan tampilan kode QRIS instan dan countdown timer.
- **Tiket Saya (`/my-tickets`)**: Dompet tiket digital dengan kode QR asli (menggunakan library `qrcode`), badge status (*Aktif / Siap Digunakan* vs *Selesai Check-in*), detail pemegang tiket, dan tombol cetak tiket (*Print Ticket*).

### 🎪 Penyelenggara Event (Organizer - GEM):
- **Dashboard Penyelenggara (`/organizer`)**: Metrik pendapatan, jumlah tiket terjual, statistik kapasitas, dan daftar event aktif.
- **Buat Event Baru (`/organizer/events/create`)**: Formulir lengkap untuk mempublikasikan acara baru dengan banner poster, jadwal, lokasi, dan **Multi-Tier Ticket Management** (tambah/hapus kategori tiket, atur harga, dan kuota).
- **Onsite QR Scanner & Validator (`/organizer/scan`)**: Antarmuka pemindaian tiket gerbang masuk untuk panitia dengan validasi instan kode tiket, pencegahan tiket ganda (*Already Used*), dan riwayat pemindaian.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library UI**: React 19, Lucide Icons, Canvas Confetti
- **Styling**: Tailwind CSS v4 & Glassmorphism Theme
- **Database & ORM**: PostgreSQL + Prisma Client v7
- **QR Code Engine**: `qrcode` library

---

## 🚀 Cara Menjalankan

### 1. Jalankan Mode Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 2. Menggunakan Database PostgreSQL (Opsional)
Aplikasi sudah dilengkapi dengan in-memory data store yang kaya sehingga **dapat langsung digunakan tanpa setup database tambahan**. 

Jika ingin menghubungkan ke PostgreSQL Anda:
1. Buat file `.env` dan isi connection string:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ticketing?schema=public"
   ```
2. Jalankan migrasi Prisma:
   ```bash
   npx prisma db push
   ```

### 3. Build Production
```bash
npm run build
npm run start
```
