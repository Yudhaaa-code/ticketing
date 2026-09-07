import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const event = dataService.getEventBySlug(slug);

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching event' },
      { status: 500 }
    );
  }
}
