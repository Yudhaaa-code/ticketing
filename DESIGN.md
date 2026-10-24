# PassGo Design Direction (DESIGN.md)

## Brand Identity & Tone
- **Product**: PassGo — Platform pemesanan tiket konser, festival musik, wahana rekreasi, pameran seni, dan konferensi di Indonesia.
- **Tone & Mood**: Energetic, trustworthy, human, clean, dan fokus pada visual poster acara.
- **Aesthetic**: Clean & Vibrant Light Theme (terinspirasi dari standar aplikasi ticketing profesional modern seperti Loket.com, Eventbrite, dan DICE).

## Dials (Liveliness Toolkit)
- **ENERGY**: 2 (Balanced — hangat, mengundang, tidak kaku tapi tidak berisik)
- **RHYTHM**: 2 (Struktur ritmis yang jelas: Hero pencarian terpusat, baris kategori geser, grid event berbobot, banner mitra terarah)
- **MOTION**: 1 (Transisi fungsional 150-200ms pada hover kartu dan tombol; tidak ada floating glow atau AI pulse animation)

## Color System
- **Surface**:
  - Background: `#F8FAFC` (Slate-50) & `#FFFFFF` (Pure White)
  - Card Surface: `#FFFFFF` dengan border tipis `#E2E8F0` (Slate-200)
  - Sub-surface / Muted: `#F1F5F9` (Slate-100)
- **Primary / Brand Accent**:
  - Primary: `#F97316` / `#EA580C` (Energetic Coral & Flame Orange)
  - Primary Hover: `#C2410C`
  - Subtle Primary: `#FFF7ED` (Orange-50 / Tint)
- **Typography & Text**:
  - Heading & Primary Text: `#0F172A` (Slate-900 — kontras tajam, terbaca jelas)
  - Secondary / Body Text: `#475569` (Slate-600)
  - Muted / Caption: `#64748B` (Slate-500)
  - Borders & Dividers: `#E2E8F0` (Slate-200)
- **Semantic Badges**:
  - Success / Live: `#059669` (Emerald-600) & `#ECFDF5`
  - Warning / Quota: `#D97706` (Amber-600) & `#FFFBEB`
  - Category tags: `#F1F5F9` (Slate-100) dengan teks `#334155` (Slate-700)

## Anti-Slop Enforcements
1. **No Purple-to-Pink Gradients**: Mengganti semua gradien generik dengan warna solid Coral/Orange atau gradien hangat yang terukur.
2. **No Ambient Blurred Blobs**: Tidak ada div blur melayang di background hero atau banner.
3. **No Decorative AI Sparkles**: Ikon sparkle dihilangkan dari tombol umum; hanya gunakan ikon fungsional (Search, MapPin, Calendar, Ticket, User).
4. **No Synthetic Prototype Explanations**: Teks login dibuat natural layaknya aplikasi live; demo switcher ditampilkan sebagai alat bantu pengujian yang rapi tanpa bahasa petunjuk buatan AI.
5. **Real Contrast & Readability**: Semua teks memenuhi standar WCAG AA (minimal 4.5:1 untuk teks normal).
