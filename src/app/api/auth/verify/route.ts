import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: 'Phone and OTP are required' },
        { status: 400 }
      );
    }

    // Mock verification
    if (otp === '123456') {
      // Typically you would generate a JWT token here and set it in a cookie
      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        token: 'mock-jwt-token-xyz-123',
        user: {
          phone: phone,
          isMember: true
        }
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid OTP' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}
