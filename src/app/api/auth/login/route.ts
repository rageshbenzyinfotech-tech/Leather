import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Here you would typically integrate with an SMS provider like Twilio
    // and generate a real OTP. For now, we mock it.
    console.log(`Sending mock OTP to ${phone}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        mockOtpReceived: '123456' // Just for development purposes
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}
