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

    const cart = await prisma.cart.findFirst({
      where: { user_id: payload.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    console.error('Fetch Cart Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const cart = await prisma.cart.findFirst({
      where: { user_id: payload.id }
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cart_id: cart.id }
      });
    }

    return NextResponse.json({ message: 'Cart cleared' }, { status: 200 });
  } catch (error) {
    console.error('Clear Cart Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
