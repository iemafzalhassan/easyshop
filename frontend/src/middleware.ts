import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/checkout', '/profile', '/orders'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Handle API requests
  if (pathname.startsWith('/api/v1')) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend URL not configured' },
        { status: 500 }
      );
    }

    // Forward the request to the backend
    const url = new URL(request.url);
    url.href = `${backendUrl}${pathname}`;

    // Forward the token if present
    const requestHeaders = new Headers(request.headers);
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }

    return NextResponse.rewrite(url, {
      headers: requestHeaders,
    });
  }

  // Check if it's a protected route and user is not authenticated
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    const response = NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, request.url)
    );
    return response;
  }

  // Check if it's an auth route and user is already authenticated
  if (authRoutes.includes(pathname) && token) {
    const response = NextResponse.redirect(new URL('/', request.url));
    return response;
  }

  // Add CORS headers
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  return response;
}

export const config = {
  matcher: [
    '/api/v1/:path*',
    '/checkout/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/login',
    '/register',
  ],
};
