import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phoneNumber, otp } = await req.json();
    const apiKey = process.env.FAST2SMS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Fast2SMS API Key is missing in environment variables' },
        { status: 500 }
      );
    }

    // Clean phone number to 10 digits
    const cleanNumber = phoneNumber.replace(/\D/g, '').slice(-10);

    // Using route=q (Quick Transactional/Dev Route) to bypass website verification restriction
    const message = `Your verification code is ${otp}`;
    const fast2smsUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=q&message=${encodeURIComponent(message)}&flash=0&numbers=${cleanNumber}`;

    const response = await fetch(fast2smsUrl, {
      method: 'GET',
      headers: {
        'cache-control': 'no-cache',
      },
    });

    const data = await response.json();

    if (data.return) {
      return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    } else {
      return NextResponse.json(
        { error: data.message || 'Failed to send OTP via Fast2SMS' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
