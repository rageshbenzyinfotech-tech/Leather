import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// User GET all products
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    // Simple filter by category if needed
    const whereClause = category ? { category, is_active: true } : { is_active: true };

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Fetch Products Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Admin POST new product
export async function POST(req: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();

    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        discount_price: data.discount_price,
        stock: data.stock,
        category: data.category,
        images: data.images || [],
        is_active: data.is_active ?? true,
      },
    });

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Create Product Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
