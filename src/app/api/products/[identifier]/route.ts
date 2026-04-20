import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ identifier: string }> }) {
  try {
    const { identifier } = await params;
    
    // Check if it's uuid or slug. For simplicity, try finding by slug first, then by id.
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: identifier },
          { id: identifier }
        ]
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Fetch Product Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ identifier: string }> }) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();

    const product = await prisma.product.update({
      where: { id: (await params).identifier }, // Assume Admin passes ID for updates
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        discount_price: data.discount_price,
        stock: data.stock,
        category: data.category,
        images: data.images,
        is_active: data.is_active,
      },
    });

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Update Product Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ identifier: string }> }) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id: (await params).identifier },
    });

    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete Product Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
