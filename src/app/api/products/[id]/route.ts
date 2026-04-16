import { NextResponse } from 'next/server';
import { products } from '@/data/products';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return NextResponse.json(
      { success: false, message: 'Product not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    data: product
  });
}
