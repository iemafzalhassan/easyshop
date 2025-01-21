import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = ['/checkout', '/profile', '/order-confirmation'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname, search } = request.nextUrl;

  // Handle API requests first
  if (pathname.startsWith('/api/v1')) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend URL not configured' },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    url.href = `${backendUrl}${pathname}`;
    const requestHeaders = new Headers(request.headers);
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }

    return NextResponse.rewrite(url, {
      headers: requestHeaders,
    });
  }

  // Check authentication state
  const isAuthenticated = !!token;

  // Handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Store the attempted URL to redirect back after login
      const redirectUrl = search ? `${pathname}${search}` : pathname;
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`, request.url)
      );
    }
    // User is authenticated, allow access to protected route
    return NextResponse.next();
  }

  // Allow access to all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/v1/:path*',
    '/checkout/:path*',
    '/profile/:path*',
    '/order-confirmation/:path*',
  ],
};
