import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // Admins can see all orders, users see their own
    const whereClause = payload.role === 'ADMIN' ? {} : { user_id: payload.id };

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
