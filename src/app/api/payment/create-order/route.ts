import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // Fetch cart to calculate total
    const cart = await prisma.cart.findFirst({
      where: { user_id: payload.id },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    let totalAmount = 0;
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
          return NextResponse.json({ error: `Product ${item.product.name} is out of stock` }, { status: 400 });
      }
      totalAmount += (item.product.discount_price || item.product.price) * item.quantity;
    }

    // Create DB Order
    const dbOrder = await prisma.order.create({
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
      }
    });

    // Create Razorpay Order
    const options = {
      amount: Math.round(totalAmount * 100), // Amount in paise
      currency: "INR",
      receipt: dbOrder.id,
    };

    const rpOrder = await razorpay.orders.create(options);

    // we could save rpOrder.id in order table if we had razorpay_order_id field, 
    // but the SRD only has `payment_id` for successful transaction. We will just return it.

    return NextResponse.json({ 
      id: rpOrder.id, 
      currency: rpOrder.currency, 
      amount: rpOrder.amount,
      dbOrderId: dbOrder.id 
    }, { status: 200 });

  } catch (error) {
    console.error('Payment Create Order Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
