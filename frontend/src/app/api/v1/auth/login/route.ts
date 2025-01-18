import { NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: result.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // TODO: Replace with your actual authentication logic
    // For now, accept any valid email/password combination
    if (email && password) {
      return NextResponse.json({
        user: {
          _id: '1', // Match the User interface
          email,
          name: email.split('@')[0], // Use email prefix as name
        },
        token: 'dummy_token',
      });
    }

    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
