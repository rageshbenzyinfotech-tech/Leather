import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const order = await prisma.order.findUnique({
      where: { id: (await params).id },
      include: {
        items: { include: { product: true } },
        user: { select: { name: true, email: true } }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Only allow admin or the user who owns the order to view it
    if (payload.role !== 'ADMIN' && order.user_id !== payload.id) {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error('Fetch Order Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update order status (Admin only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = (await cookies()).get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
        const payload = verifyToken(token);
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    
        const { status } = await req.json();
    
        const updatedOrder = await prisma.order.update({
            where: { id: (await params).id },
            data: { status }
        });
    
        return NextResponse.json({ order: updatedOrder }, { status: 200 });
    } catch (error) {
        console.error('Update Order Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
