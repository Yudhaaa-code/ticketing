import { NextResponse } from 'next/server';
import { dataService } from '@/lib/data';

export async function GET() {
  try {
    const categories = dataService.getCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal mengambil kategori' },
      { status: 500 }
    );
  }
}
