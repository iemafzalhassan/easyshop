import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/checkout', '/profile', '/orders'];
const authRoutes = ['/login', '/register'];

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
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }
    // User is authenticated, allow access to protected route
    return NextResponse.next();
  }

  // Handle auth routes (login/register)
  if (authRoutes.includes(pathname)) {
    if (isAuthenticated) {
      // Get the redirect URL from query params
      const params = new URLSearchParams(search);
      const redirectUrl = params.get('redirect');
      
      // If there's a redirect URL and it's a protected route, go there
      if (redirectUrl && protectedRoutes.some(route => redirectUrl.startsWith(route))) {
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
      
      // Otherwise go to home
      return NextResponse.redirect(new URL('/', request.url));
    }
    // User is not authenticated, allow access to auth routes
    return NextResponse.next();
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
