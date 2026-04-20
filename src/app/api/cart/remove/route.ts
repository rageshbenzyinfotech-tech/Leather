import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { cart_item_id } = await req.json();

    if (!cart_item_id) {
      return NextResponse.json({ error: 'cart_item_id is required' }, { status: 400 });
    }

    // Verify that the cart item belongs to the user's cart
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cart_item_id },
      include: { cart: true }
    });

    if (!cartItem || cartItem.cart.user_id !== payload.id) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: cart_item_id }
    });

    return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 });
  } catch (error) {
    console.error('Remove from Cart Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
