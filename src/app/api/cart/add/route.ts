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

    const { product_id, quantity } = await req.json();

    // Check if product exists and in stock
    const product = await prisma.product.findUnique({ where: { id: product_id } });
    if (!product || product.stock < quantity) {
      return NextResponse.json({ error: 'Product unavailable or out of stock' }, { status: 400 });
    }

    let cart = await prisma.cart.findFirst({
      where: { user_id: payload.id }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { user_id: payload.id }
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        product_id: product_id
      }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          product_id: product_id,
          quantity: quantity
        }
      });
    }

    return NextResponse.json({ message: 'Added to cart successfully' }, { status: 200 });
  } catch (error) {
    console.error('Add to Cart Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
