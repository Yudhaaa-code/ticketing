import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketCode } = body;

    if (!ticketCode) {
      return NextResponse.json(
        { success: false, message: 'Kode tiket wajib diisi.' },
        { status: 400 }
      );
    }

    const result = dataService.checkInTicket(ticketCode.trim());

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message, ticket: result.ticket },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      ticket: result.ticket,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memvalidasi tiket' },
      { status: 500 }
    );
  }
}
