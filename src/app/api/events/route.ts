import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category') || undefined;
    const city = searchParams.get('city') || undefined;
    const search = searchParams.get('search') || undefined;
    const isFeaturedParam = searchParams.get('featured');
    const isPopularParam = searchParams.get('popular');

    const isFeatured = isFeaturedParam !== null ? isFeaturedParam === 'true' : undefined;
    const isPopular = isPopularParam !== null ? isPopularParam === 'true' : undefined;

    const events = dataService.getAllEvents({
      categorySlug,
      city,
      search,
      isFeatured,
      isPopular,
    });

    return NextResponse.json({ success: true, count: events.length, data: events });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memuat events' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.venueName || !body.city || !body.startDate) {
      return NextResponse.json(
        { success: false, message: 'Harap lengkapi field wajib event.' },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newEvent = dataService.createEvent({
      title: body.title,
      slug,
      tagline: body.tagline || '',
      description: body.description || '',
      terms: body.terms || '',
      bannerUrl:
        body.bannerUrl ||
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&auto=format&fit=crop&q=80',
      thumbnailUrl: body.thumbnailUrl || body.bannerUrl,
      categoryId: body.categoryId || 'cat-music',
      organizerId: body.organizerId || 'org-custom',
      organizer: {
        id: 'org-custom',
        userId: 'usr-organizer',
        organizationName: body.organizerName || 'Mitra Penyelenggara',
        verified: true,
        phone: body.organizerPhone || '0812-0000-0000',
      },
      venueName: body.venueName,
      address: body.address || body.venueName,
      city: body.city,
      startDate: body.startDate,
      endDate: body.endDate || body.startDate,
      isFeatured: Boolean(body.isFeatured),
      isPopular: Boolean(body.isPopular),
      status: 'PUBLISHED',
      ticketTiers:
        body.ticketTiers && body.ticketTiers.length > 0
          ? body.ticketTiers.map((tier: any, i: number) => ({
              id: `tier-${Date.now()}-${i}`,
              eventId: '',
              name: tier.name || 'Tiket Reguler',
              description: tier.description || '',
              price: Number(tier.price) || 0,
              quota: Number(tier.quota) || 100,
              soldCount: 0,
              maxPerOrder: Number(tier.maxPerOrder) || 4,
            }))
          : [
              {
                id: `tier-${Date.now()}-0`,
                eventId: '',
                name: 'General Admission',
                description: 'Tiket masuk reguler',
                price: 100000,
                quota: 200,
                soldCount: 0,
                maxPerOrder: 4,
              },
            ],
    });

    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal membuat event' },
      { status: 500 }
    );
  }
}
