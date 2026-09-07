import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || undefined;
    const tickets = dataService.getUserTickets(email);

    return NextResponse.json({ success: true, count: tickets.length, data: tickets });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memuat tiket' },
      { status: 500 }
    );
  }
}
