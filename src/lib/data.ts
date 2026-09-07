import { Category, EventItem, Order, Ticket, OrderStatus, PaymentMethod } from './types';
import { generateOrderNumber, generateTicketCode } from './utils';

export const initialCategories: Category[] = [
  {
    id: 'cat-music',
    name: 'Konser & Musik',
    slug: 'konser-musik',
    icon: 'Music2',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    color: 'from-fuchsia-500 to-pink-600',
  },
  {
    id: 'cat-attractions',
    name: 'Atraksi & Rekreasi',
    slug: 'atraksi-rekreasi',
    icon: 'FerrisWheel',
    imageUrl: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800&auto=format&fit=crop&q=80',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'cat-festivals',
    name: 'Festival & Budaya',
    slug: 'festival-budaya',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80',
    color: 'from-violet-600 to-indigo-600',
  },
  {
    id: 'cat-sports',
    name: 'Olahraga & Kebugaran',
    slug: 'olahraga',
    icon: 'Trophy',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'cat-workshop',
    name: 'Workshop & Edukasi',
    slug: 'workshop-edukasi',
    icon: 'GraduationCap',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'cat-arts',
    name: 'Pameran & Seni',
    slug: 'pameran-seni',
    icon: 'Palette',
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80',
    color: 'from-rose-500 to-red-600',
  },
];

export const initialEvents: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Jakarta SoundWave Festival 2026',
    slug: 'jakarta-soundwave-festival-2026',
    tagline: 'Festival musik multi-genre terbesar tahun ini di tepi pantai Ancol',
    description: `Jakarta SoundWave Festival 2026 kembali hadir menghadirkan deretan musisi papan atas nasional dan internasional! Nikmati 3 panggung megah, instalasi seni interaktif, food market kuliner legendaris, dan pertunjukan kembang api spektakuler di tepi pantai Jakarta.

Line Up Musisi:
- Sheila on 7
- Maliq & D'Essentials
- Hindia
- Reality Club
- Dipha Barus x Weird Genius
- Special International Headliner

Fasilitas Lengkap:
- Prayer Room / Musholla Nyaman
- Medical Center & Ambulance On Standby
- Charging Station & Loker Penitipan Barang
- Accessible Area untuk Pengguna Kursi Roda`,
    terms: `1. Tiket yang sudah dibeli tidak dapat ditukar atau dikembalikan (non-refundable).
2. Wajib membawa kartu identitas asli (KTP/SIM/Paspor) saat penukaran gelang / scan tiket.
3. Anak-anak di atas usia 5 tahun wajib memiliki tiket tersendiri.
4. Dilarang membawa makanan dan minuman dari luar area festival.
5. Dilarang membawa senjata tajam, narkotika, dan kamera profesional (DSLR/Mirrorless dengan lensa tele).`,
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1400&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    categoryId: 'cat-music',
    organizerId: 'org-soundwave',
    organizer: {
      id: 'org-soundwave',
      userId: 'usr-org-1',
      organizationName: 'SoundWave Entertainment Indonesia',
      description: 'Promotor festival musik terpercaya dengan standar festival kelas dunia.',
      logo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=120&auto=format&fit=crop&q=80',
      verified: true,
      phone: '0812-8899-0011',
      website: 'https://soundwave.id',
    },
    venueName: 'Carnaval Beach Ancol',
    address: 'Jl. Lodan Timur No. 7, Ancol, Pademangan',
    city: 'Jakarta Utara',
    mapsUrl: 'https://maps.google.com/?q=Carnaval+Beach+Ancol',
    startDate: '2026-10-18T14:00:00.000Z',
    endDate: '2026-10-19T23:59:00.000Z',
    isFeatured: true,
    isPopular: true,
    status: 'PUBLISHED',
    ticketTiers: [
      {
        id: 'tier-1-1',
        eventId: 'evt-1',
        name: 'Presale 1 - General Admission',
        description: 'Akses masuk area festival 2 hari penuh, akses seluruh stage reguler.',
        price: 350000,
        quota: 1000,
        soldCount: 840,
        maxPerOrder: 4,
      },
      {
        id: 'tier-1-2',
        eventId: 'evt-1',
        name: 'VIP Front Row Experience',
        description: 'Barisan terdepan di depan Main Stage, antrean khusus, VIP Lounge dengan AC & welcome drinks.',
        price: 850000,
        quota: 300,
        soldCount: 220,
        maxPerOrder: 4,
      },
      {
        id: 'tier-1-3',
        eventId: 'evt-1',
        name: 'VVIP Royal Backstage Pass',
        description: 'Akses VIP lounge, exclusive meet & greet session, official merchandise pack, private parking slot.',
        price: 1850000,
        quota: 50,
        soldCount: 45,
        maxPerOrder: 2,
      },
    ],
  },
  {
    id: 'evt-2',
    title: 'Dunia Fantasi (Dufan) Annual Pass & Day Ticket',
    slug: 'dunia-fantasi-dufan-annual-pass-day-ticket',
    tagline: 'Rasakan petualangan tanpa batas dengan lebih dari 30 wahana seru!',
    description: `Dunia Fantasi (Dufan) Ancol adalah taman hiburan outdoor theme park terbesar di Indonesia yang memanjakan imajinasi Anda dengan berbagai wahana berteknologi tinggi, mulai dari Halilintar, Tornado, Ontang-Anting, Kora-Kora, hingga Rumah Kaca dan Istana Boneka.

Cocok untuk liburan keluarga, hangout bersama teman, dan menguji adrenalin! Tiket sudah termasuk akses masuk ke seluruh wahana yang beroperasi.`,
    terms: `1. Tiket sudah termasuk tiket masuk Pintu Gerbang Utama Ancol (untuk tiket tertentu).
2. Tiket berlaku sesuai tanggal kunjungan yang dipilih.
3. Tiket tidak dapat dipindahtangankan atau di-reschedule setelah transaksi berhasil.
4. Jam operasional: Senin - Minggu (10:00 - 18:00 WIB).`,
    bannerUrl: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=1400&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=600&auto=format&fit=crop&q=80',
    categoryId: 'cat-attractions',
    organizerId: 'org-ancol',
    organizer: {
      id: 'org-ancol',
      userId: 'usr-org-2',
      organizationName: 'PT Pembangunan Jaya Ancol Tbk',
      description: 'Kawasan wisata terpadu terbesar dan terlengkap di tepi laut Jakarta.',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
      verified: true,
      phone: '021-29222222',
      website: 'https://ancol.com',
    },
    venueName: 'Taman Impian Jaya Ancol',
    address: 'Jl. Lodan Timur No. 7, RW.10, Ancol, Pademangan',
    city: 'Jakarta Utara',
    mapsUrl: 'https://maps.google.com/?q=Dufan+Ancol',
    startDate: '2026-09-10T10:00:00.000Z',
    endDate: '2026-12-31T18:00:00.000Z',
    isFeatured: true,
    isPopular: true,
    status: 'PUBLISHED',
    ticketTiers: [
      {
        id: 'tier-2-1',
        eventId: 'evt-2',
        name: 'Reguler Weekday Ticket',
        description: 'Berlaku untuk 1 kali kunjungan pada hari Senin s/d Jumat (di luar hari libur nasional).',
        price: 225000,
        quota: 5000,
        soldCount: 3200,
        maxPerOrder: 6,
      },
      {
        id: 'tier-2-2',
        eventId: 'evt-2',
        name: 'Reguler Weekend / Holiday Ticket',
        description: 'Berlaku untuk 1 kali kunjungan pada hari Sabtu, Minggu, atau Hari Libur Nasional.',
        price: 275000,
        quota: 5000,
        soldCount: 4100,
        maxPerOrder: 6,
      },
      {
        id: 'tier-2-3',
        eventId: 'evt-2',
        name: 'Annual Pass Dufan (Main Sepuasnya 1 Tahun)',
        description: 'Kartu pass ke Dufan gratis tanpa batas selama 365 hari penuh sejak aktivasi!',
        price: 399000,
        quota: 1000,
        soldCount: 890,
        maxPerOrder: 4,
      },
    ],
  },
  {
    id: 'evt-3',
    title: 'Bandung Indie Beats & Culinary Fest',
    slug: 'bandung-indie-beats-culinary-fest',
    tagline: 'Perpaduan musik syahdu khas Kota Kembang & ragam kuliner legendaris',
    description: `Rasakan sejuknya Bandung dipadukan dengan alunan melodi manis dari grup indie favoritmu, ditemani deretan tenant kuliner viral dan kopi artisan terbaik se-Bandung Raya.

Akan ada panggung akustik intim, workshop meracik kopi, dan bazaar fashion kreatif dari brand lokal terkemuka.`,
    terms: `1. E-tiket akan dikirimkan via email dan dapat diakses di menu Tiket Saya.
2. Dilarang membawa makanan dan minuman dari luar area festival.
3. Penyelenggara berhak menolak pengunjung yang tidak mematuhi protokol keamanan.`,
    bannerUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1400&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&auto=format&fit=crop&q=80',
    categoryId: 'cat-festivals',
    organizerId: 'org-kembang',
    organizer: {
      id: 'org-kembang',
      userId: 'usr-org-3',
      organizationName: 'Kolektif Kreatif Bandung',
      description: 'Komunitas penggerak festival musik & expo kuliner nusantara.',
      verified: true,
      phone: '0813-2211-9988',
    },
    venueName: 'Kiara Artha Park',
    address: 'Jl. Banten, Kebonwaru, Batununggal',
    city: 'Bandung',
    mapsUrl: 'https://maps.google.com/?q=Kiara+Artha+Park+Bandung',
    startDate: '2026-11-07T13:00:00.000Z',
    endDate: '2026-11-08T22:00:00.000Z',
    isFeatured: true,
    isPopular: false,
    status: 'PUBLISHED',
    ticketTiers: [
      {
        id: 'tier-3-1',
        eventId: 'evt-3',
        name: 'Single Day Pass (Day 1)',
        description: 'Akses masuk hari Sabtu 7 November 2026.',
        price: 125000,
        quota: 800,
        soldCount: 450,
        maxPerOrder: 5,
      },
      {
        id: 'tier-3-2',
        eventId: 'evt-3',
        name: '2-Day Pass Bundle (Hemat)',
        description: 'Akses masuk bebas keluar-masuk selama 2 hari + voucher kuliner Rp 50.000.',
        price: 210000,
        quota: 1200,
        soldCount: 920,
        maxPerOrder: 5,
      },
    ],
  },
  {
    id: 'evt-4',
    title: 'Jakarta International Marathon 2026',
    slug: 'jakarta-international-marathon-2026',
    tagline: 'Taklukkan jalanan protokol ibu kota dalam lari maraton bergengsi',
    description: `Ajang lomba lari maraton berskala internasional dengan sertifikasi World Athletics. Melintasi landmark ikonik Jakarta: Monas, Bundaran HI, GBK Senayan, dan koridor Sudirman-Thamrin dengan rute steril dan cheering zone yang semarak.

Kategori yang dibuka:
- 5K Fun Run
- 10K National Championship
- 21K Half Marathon
- 42K Full Marathon`,
    terms: `1. Peserta dalam kondisi sehat jasmani dan rohani.
2. Usia minimal kategori Full Marathon adalah 18 tahun.
3. Race Pack Collection (RPC) wajib diambil sesuai jadwal H-2 perlombaan.`,
    bannerUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1400&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
    categoryId: 'cat-sports',
    organizerId: 'org-running',
    organizer: {
      id: 'org-running',
      userId: 'usr-org-4',
      organizationName: 'IndoRunners Global Event',
      description: 'Penyelenggara race lari profesional dengan standar keselamatan medis terdepan.',
      verified: true,
      phone: '0811-9988-7766',
    },
    venueName: 'Plaza Barat Gelora Bung Karno (GBK)',
    address: 'Jl. Pintu Satu Senayan, Gelora, Tanah Abang',
    city: 'Jakarta Pusat',
    mapsUrl: 'https://maps.google.com/?q=GBK+Senayan',
    startDate: '2026-11-22T05:00:00.000Z',
    endDate: '2026-11-22T11:00:00.000Z',
    isFeatured: false,
    isPopular: true,
    status: 'PUBLISHED',
    ticketTiers: [
      {
        id: 'tier-4-1',
        eventId: 'evt-4',
        name: '5K Fun Run Slot',
        description: 'Termasuk Jersey lari DRI-FIT, Medali Finisher, Nomor Dada (BIB) with Timing Chip, Goodie Bag.',
        price: 250000,
        quota: 2000,
        soldCount: 1750,
        maxPerOrder: 3,
      },
      {
        id: 'tier-4-2',
        eventId: 'evt-4',
        name: '10K Challenge Slot',
        description: 'Termasuk Jersey, BIB Chip, Finisher Medal, Hydration Points setiap 2.5 km.',
        price: 375000,
        quota: 2500,
        soldCount: 2100,
        maxPerOrder: 3,
      },
      {
        id: 'tier-4-3',
        eventId: 'evt-4',
        name: '21K Half Marathon Slot',
        description: 'Termasuk Exclusive Jersey, Finisher Tee, Finisher Medal, Timing Chip, Asuransi Kecelakaan.',
        price: 550000,
        quota: 1500,
        soldCount: 1420,
        maxPerOrder: 2,
      },
    ],
  },
  {
    id: 'evt-5',
    title: 'NextGen AI & Modern Web Summit 2026',
    slug: 'nextgen-ai-modern-web-summit-2026',
    tagline: 'Konferensi teknologi terbesar untuk developer, AI engineer, dan tech leader',
    description: `Pelajari tren terkini dari arsitektur Next.js, LLM Agents, Fullstack TypeScript, Cloud Native, dan Real-time Applications langsung dari para praktisi dan kontributor open-source kelas dunia.

Dilengkapi dengan hands-on coding workshop, mentoring session 1-on-1, dan networking dinner bersama CTO tech unicorn Indonesia.`,
    terms: `1. Peserta diharapkan membawa laptop sendiri untuk sesi workshop interaktif.
2. Sertifikat partisipasi resmi akan dikirim secara digital setelah acara selesai.`,
    bannerUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1400&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80',
    categoryId: 'cat-workshop',
    organizerId: 'org-tech',
    organizer: {
      id: 'org-tech',
      userId: 'usr-org-5',
      organizationName: 'DevCommunity Indonesia',
      description: 'Wadah bertumbuh bagi ribuan talenta developer & engineer Indonesia.',
      verified: true,
      phone: '0812-3456-7890',
      website: 'https://devcommunity.id',
    },
    venueName: 'Indonesia Convention Exhibition (ICE) BSD',
    address: 'Jl. BSD Grand Boulevard No. 1, Pagedangan',
    city: 'Tangerang',
    mapsUrl: 'https://maps.google.com/?q=ICE+BSD+City',
    startDate: '2026-12-05T09:00:00.000Z',
    endDate: '2026-12-06T17:00:00.000Z',
    isFeatured: false,
    isPopular: true,
    status: 'PUBLISHED',
    ticketTiers: [
      {
        id: 'tier-5-1',
        eventId: 'evt-5',
        name: 'Conference Only Ticket (2 Days)',
        description: 'Akses ke semua keynote stage, exhibition booth, lunch box & coffee break 2 hari.',
        price: 450000,
        quota: 800,
        soldCount: 610,
        maxPerOrder: 5,
      },
      {
        id: 'tier-5-2',
        eventId: 'evt-5',
        name: 'All-Access Pass (Conference + Workshop)',
        description: 'Termasuk conference pass + deep-dive hands-on workshop kelas privat + goodie bag eksklusif.',
        price: 1100000,
        quota: 200,
        soldCount: 160,
        maxPerOrder: 3,
      },
    ],
  },
  {
    id: 'evt-6',
    title: 'Art Jakarta Contemporary Exhibition 2026',
    slug: 'art-jakarta-contemporary-exhibition-2026',
    tagline: 'Pameran seni rupa modern, lukisan kontemporer, dan instalasi visual imersif',
    description: `Temukan ratusan karya seni menakjubkan dari seniman terkemuka tanah air dan mancanegara. Menampilkan lukisan kanvas, patung modern, video art interaktif, dan galeri fotografi arsitektur perkotaan.`,
    terms: `1. Tidak diperkenankan menyentuh karya seni tanpa izin kurator.
2. Dilarang menyalakan flash kamera saat mengambil foto di dalam galeri.`,
    bannerUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1400&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&auto=format&fit=crop&q=80',
    categoryId: 'cat-arts',
    organizerId: 'org-art',
    organizer: {
      id: 'org-art',
      userId: 'usr-org-6',
      organizationName: 'Yayasan Seni Rupa Nusantara',
      description: 'Mendukung apresiasi seni dan perkembangan seniman muda Indonesia.',
      verified: true,
    },
    venueName: 'Jakarta International Expo (JIExpo) Kemayoran',
    address: 'Gedung Pusat Niaga, Arena PRJ Kemayoran',
    city: 'Jakarta Pusat',
    mapsUrl: 'https://maps.google.com/?q=JIExpo+Kemayoran',
    startDate: '2026-10-24T10:00:00.000Z',
    endDate: '2026-10-26T21:00:00.000Z',
    isFeatured: false,
    isPopular: false,
    status: 'PUBLISHED',
    ticketTiers: [
      {
        id: 'tier-6-1',
        eventId: 'evt-6',
        name: 'General Exhibition Entry',
        description: 'Tiket masuk harian untuk menikmati seluruh area galeri & diskusi seni.',
        price: 85000,
        quota: 3000,
        soldCount: 1400,
        maxPerOrder: 6,
      },
    ],
  },
];

// Sample demo tickets already purchased
export const initialTickets: Ticket[] = [
  {
    id: 'tkt-demo-1',
    ticketCode: 'VIP-SW8829',
    qrData: 'GOERS:TKT:VIP-SW8829:evt-1:tier-1-2',
    orderId: 'ord-demo-1',
    ticketTierId: 'tier-1-2',
    ticketTierName: 'VIP Front Row Experience',
    eventTitle: 'Jakarta SoundWave Festival 2026',
    eventDate: '2026-10-18T14:00:00.000Z',
    eventVenue: 'Carnaval Beach Ancol, Jakarta Utara',
    attendeeName: 'Budi Santoso',
    attendeeEmail: 'budi.santoso@example.com',
    isCheckedIn: false,
    checkedInAt: null,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'tkt-demo-2',
    ticketCode: 'REG-DF1142',
    qrData: 'GOERS:TKT:REG-DF1142:evt-2:tier-2-2',
    orderId: 'ord-demo-2',
    ticketTierId: 'tier-2-2',
    ticketTierName: 'Reguler Weekend / Holiday Ticket',
    eventTitle: 'Dunia Fantasi (Dufan) Annual Pass & Day Ticket',
    eventDate: '2026-09-10T10:00:00.000Z',
    eventVenue: 'Taman Impian Jaya Ancol, Jakarta Utara',
    attendeeName: 'Siti Rahma',
    attendeeEmail: 'siti.rahma@example.com',
    isCheckedIn: true,
    checkedInAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const initialOrders: Order[] = [
  {
    id: 'ord-demo-1',
    orderNumber: 'GOERS-20260905-1842',
    eventId: 'evt-1',
    customerName: 'Budi Santoso',
    customerEmail: 'budi.santoso@example.com',
    customerPhone: '081298765432',
    customerIdCard: '3171012304950001',
    totalAmount: 855000,
    platformFee: 5000,
    status: 'PAID',
    paymentMethod: 'QRIS',
    paidAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    expiredAt: new Date(Date.now() + 86400000 * 10).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      {
        id: 'item-demo-1',
        orderId: 'ord-demo-1',
        ticketTierId: 'tier-1-2',
        quantity: 1,
        unitPrice: 850000,
        subtotal: 850000,
      },
    ],
    tickets: [initialTickets[0]],
  },
];

// In-Memory Global State for seamless dev & mock persistence
declare global {
  var __mockEvents: EventItem[] | undefined;
  var __mockOrders: Order[] | undefined;
  var __mockTickets: Ticket[] | undefined;
}

if (!globalThis.__mockEvents) {
  globalThis.__mockEvents = [...initialEvents];
}
if (!globalThis.__mockOrders) {
  globalThis.__mockOrders = [...initialOrders];
}
if (!globalThis.__mockTickets) {
  globalThis.__mockTickets = [...initialTickets];
}

// Data Access Service
export const dataService = {
  getCategories(): Category[] {
    return initialCategories;
  },

  getCategoryBySlug(slug: string): Category | undefined {
    return initialCategories.find((c) => c.slug === slug);
  },

  getAllEvents(filters?: {
    categorySlug?: string;
    city?: string;
    search?: string;
    isFeatured?: boolean;
    isPopular?: boolean;
  }): EventItem[] {
    let list = [...(globalThis.__mockEvents || initialEvents)];

    if (filters?.categorySlug) {
      const cat = initialCategories.find((c) => c.slug === filters.categorySlug);
      if (cat) {
        list = list.filter((e) => e.categoryId === cat.id);
      }
    }

    if (filters?.city) {
      list = list.filter((e) => e.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venueName.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q)
      );
    }

    if (filters?.isFeatured !== undefined) {
      list = list.filter((e) => e.isFeatured === filters.isFeatured);
    }

    if (filters?.isPopular !== undefined) {
      list = list.filter((e) => e.isPopular === filters.isPopular);
    }

    return list;
  },

  getEventBySlug(slug: string): EventItem | undefined {
    const events = globalThis.__mockEvents || initialEvents;
    const event = events.find((e) => e.slug === slug);
    if (!event) return undefined;

    const category = initialCategories.find((c) => c.id === event.categoryId);
    return {
      ...event,
      category,
    };
  },

  getEventById(id: string): EventItem | undefined {
    const events = globalThis.__mockEvents || initialEvents;
    return events.find((e) => e.id === id);
  },

  createEvent(eventData: Omit<EventItem, 'id' | 'createdAt'>): EventItem {
    const newEvent: EventItem = {
      ...eventData,
      id: `evt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    if (!globalThis.__mockEvents) globalThis.__mockEvents = [];
    globalThis.__mockEvents.unshift(newEvent);
    return newEvent;
  },

  createOrder(payload: {
    eventId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerIdCard?: string;
    paymentMethod: PaymentMethod;
    items: { ticketTierId: string; quantity: number }[];
  }): Order {
    const event = this.getEventById(payload.eventId);
    if (!event) throw new Error('Event tidak ditemukan');

    let totalAmount = 0;
    const orderItems = payload.items.map((item, idx) => {
      const tier = event.ticketTiers.find((t) => t.id === item.ticketTierId);
      if (!tier) throw new Error(`Ticket tier ${item.ticketTierId} tidak ditemukan`);
      const subtotal = tier.price * item.quantity;
      totalAmount += subtotal;

      // Update sold count
      tier.soldCount += item.quantity;

      return {
        id: `item-${Date.now()}-${idx}`,
        orderId: '',
        ticketTierId: tier.id,
        ticketTier: tier,
        quantity: item.quantity,
        unitPrice: tier.price,
        subtotal,
      };
    });

    const platformFee = 5000;
    const orderId = `ord-${Date.now()}`;
    const orderNumber = generateOrderNumber();

    // Generate Tickets
    const tickets: Ticket[] = [];
    payload.items.forEach((item) => {
      const tier = event.ticketTiers.find((t) => t.id === item.ticketTierId);
      for (let i = 0; i < item.quantity; i++) {
        const ticketCode = generateTicketCode(tier?.name || 'TKT');
        tickets.push({
          id: `tkt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          ticketCode,
          qrData: `GOERS:TKT:${ticketCode}:${event.id}:${item.ticketTierId}`,
          orderId,
          ticketTierId: item.ticketTierId,
          ticketTierName: tier?.name,
          eventTitle: event.title,
          eventDate: event.startDate,
          eventVenue: `${event.venueName}, ${event.city}`,
          attendeeName: payload.customerName,
          attendeeEmail: payload.customerEmail,
          isCheckedIn: false,
          checkedInAt: null,
          createdAt: new Date().toISOString(),
        });
      }
    });

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      eventId: event.id,
      event,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      customerIdCard: payload.customerIdCard,
      totalAmount: totalAmount + platformFee,
      platformFee,
      status: 'PAID', // Instant success for simulation, or PENDING
      paymentMethod: payload.paymentMethod,
      paidAt: new Date().toISOString(),
      expiredAt: new Date(Date.now() + 24 * 3600000).toISOString(),
      createdAt: new Date().toISOString(),
      items: orderItems.map((oi) => ({ ...oi, orderId })),
      tickets,
    };

    if (!globalThis.__mockOrders) globalThis.__mockOrders = [];
    globalThis.__mockOrders.unshift(newOrder);

    if (!globalThis.__mockTickets) globalThis.__mockTickets = [];
    globalThis.__mockTickets.unshift(...tickets);

    return newOrder;
  },

  getOrderById(id: string): Order | undefined {
    const orders = globalThis.__mockOrders || initialOrders;
    const order = orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return undefined;

    if (!order.event) {
      order.event = this.getEventById(order.eventId);
    }
    return order;
  },

  getUserTickets(email?: string): Ticket[] {
    const tickets = globalThis.__mockTickets || initialTickets;
    if (!email) return tickets;
    return tickets.filter((t) => t.attendeeEmail.toLowerCase() === email.toLowerCase());
  },

  getTicketByCode(ticketCode: string): Ticket | undefined {
    const tickets = globalThis.__mockTickets || initialTickets;
    return tickets.find(
      (t) => t.ticketCode.toLowerCase() === ticketCode.toLowerCase() || t.qrData.includes(ticketCode)
    );
  },

  checkInTicket(ticketCode: string): { success: boolean; message: string; ticket?: Ticket } {
    const ticket = this.getTicketByCode(ticketCode);
    if (!ticket) {
      return { success: false, message: 'Tiket tidak ditemukan dalam sistem.' };
    }
    if (ticket.isCheckedIn) {
      return {
        success: false,
        message: `Tiket sudah pernah di-check-in sebelumnya pada ${ticket.checkedInAt || 'tadi'}.`,
        ticket,
      };
    }

    ticket.isCheckedIn = true;
    ticket.checkedInAt = new Date().toISOString();

    return {
      success: true,
      message: 'Check-in berhasil! Selamat menikmati event.',
      ticket,
    };
  },
};
