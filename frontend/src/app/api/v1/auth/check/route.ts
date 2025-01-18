import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersList = headers();
    const token = headersList.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(false);
    }

    // Forward the request to the backend with the token
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/validate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(false);
    }

    return NextResponse.json(true);
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(false);
  }
}
