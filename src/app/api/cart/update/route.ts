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

    const { cart_item_id, quantity } = await req.json();

    if (!cart_item_id || quantity === undefined) {
      return NextResponse.json({ error: 'cart_item_id and quantity are required' }, { status: 400 });
    }

    // Verify that the cart item belongs to this user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cart_item_id },
      include: { cart: true, product: true }
    });

    if (!cartItem || cartItem.cart.user_id !== payload.id) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Check stock
    if (quantity > cartItem.product.stock) {
      return NextResponse.json({ error: 'Not enough stock available' }, { status: 400 });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await prisma.cartItem.delete({ where: { id: cart_item_id } });
      return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: cart_item_id },
      data: { quantity }
    });

    return NextResponse.json({ cartItem: updatedItem }, { status: 200 });
  } catch (error) {
    console.error('Update Cart Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
