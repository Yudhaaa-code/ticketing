import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventId,
      customerName,
      customerEmail,
      customerPhone,
      customerIdCard,
      paymentMethod,
      items,
    } = body;

    if (!eventId || !customerName || !customerEmail || !customerPhone || !items?.length) {
      return NextResponse.json(
        { success: false, message: 'Data pemesanan tidak lengkap.' },
        { status: 400 }
      );
    }

    const order = dataService.createOrder({
      eventId,
      customerName,
      customerEmail,
      customerPhone,
      customerIdCard,
      paymentMethod: paymentMethod || 'QRIS',
      items,
    });

    return NextResponse.json({
      success: true,
      message: 'Pesanan berhasil dibuat!',
      data: order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memproses pesanan' },
      { status: 500 }
    );
  }
}
