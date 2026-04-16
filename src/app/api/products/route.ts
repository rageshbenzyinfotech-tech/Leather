import { NextResponse } from 'next/server';
import { products } from '@/data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  let result = products;
  
  if (category && category !== 'all') {
    result = products.filter(p => p.category === category);
  }
  
  return NextResponse.json({
    success: true,
    count: result.length,
    data: result
  });
}
