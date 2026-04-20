import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      dbOrderId 
    } = await req.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      // Update order status to PAID
      const order = await prisma.order.update({
        where: { id: dbOrderId },
        data: { 
          status: 'PAID',
          payment_id: razorpay_payment_id
        },
        include: { items: true }
      });

      // Deduct stock for each item
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.product_id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // Auto-clear cart after successful payment
      await prisma.cartItem.deleteMany({
        where: { cart: { user_id: payload.id } }
      });

      return NextResponse.json({ message: 'Payment verified successfully' }, { status: 200 });
    } else {
      // Payment verification failed
      await prisma.order.update({
        where: { id: dbOrderId },
        data: { status: 'FAILED' }
      });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment Verify Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
