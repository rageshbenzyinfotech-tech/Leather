import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total_amount, shipping_address, customer } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!shipping_address || !customer) {
       return NextResponse.json(
        { success: false, message: 'Missing shipping or customer details' },
        { status: 400 }
      );     
    }

    // Mock order creation
    const orderId = `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: orderId,
        status: 'processing',
        total_amount,
        items_count: items.length
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}
