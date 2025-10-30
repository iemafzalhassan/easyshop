import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/utils";
import User from "@/lib/models/user";
import dbConnect from "@/lib/db";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('Checking authentication status');
    // Log headers for debugging
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    const auth = await isAuthenticated(request);
    
    if (!auth || !auth.userId) {
      console.log('No valid authentication found');
      // Add CORS headers for the error response
      const response = NextResponse.json({ authenticated: false }, { status: 401 });
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return response;
    }

    // Connect to database and get user details
    await dbConnect();
    const user = await User.findById(auth.userId).select('-password');
    
    if (!user) {
      console.log('User not found:', auth.userId);
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    console.log('User authenticated:', user._id);
    const response = NextResponse.json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: "Authentication check failed" },
      { status: 401 }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
