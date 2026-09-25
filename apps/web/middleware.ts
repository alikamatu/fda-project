import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for token in cookies or Authorization header
  // The actual auth validation happens on the API level
  const cookieToken = request.cookies.get('auth-token')?.value;
  const authHeader = request.headers.get('authorization');
  const hasToken = !!cookieToken || !!authHeader;
  
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/', '/how-it-works', '/features', '/trust', '/admin/verifications'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If trying to access protected route without any token indication
  // Note: Token in localStorage can't be checked server-side, so we allow the request
  // and let the API handle auth validation
  if (!hasToken && !isPublicRoute) {
    // Allow the request through - API will handle 401 if needed
    // This prevents redirecting users who have tokens in localStorage
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
