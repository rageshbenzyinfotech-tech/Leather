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

    // Fetch user's cart
    const cart = await prisma.cart.findFirst({
      where: { user_id: payload.id },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Verify stock for all items
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `${item.product.name} is out of stock (available: ${item.product.stock})` 
        }, { status: 400 });
      }
    }

    // Calculate total
    let totalAmount = 0;
    for (const item of cart.items) {
      totalAmount += (item.product.discount_price || item.product.price) * item.quantity;
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        user_id: payload.id,
        total_amount: totalAmount,
        status: 'PENDING',
        items: {
          create: cart.items.map(item => ({
            product_id: item.product_id,
            price: item.product.discount_price || item.product.price,
            quantity: item.quantity,
          }))
        }
      },
      include: {
        items: { include: { product: true } }
      }
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
