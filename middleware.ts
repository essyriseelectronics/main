import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth/session';

// Define which routes require authentication
const protectedRoutes = ['/admin', '/profile', '/checkout'];

// Define which routes are only for logged-out users
const authRoutes = ['/login', '/register', '/forgot-password'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Check if the current path matches any protected or auth routes
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.includes(path);

  // Read the session cookie and decrypt it using jose
  const cookie = req.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  // 1. If trying to access a protected route without a valid session -> Redirect to Login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // 2. If trying to access login/register while ALREADY logged in -> Redirect to Home
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  // 3. Admin Route Protection: If trying to access /admin but role is not ADMIN -> Redirect to Home
  if (path.startsWith('/admin') && session?.role !== 'ADMIN') {
    // Note: We'll assume your admin users have the 'ADMIN' role in the database
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  // Allow the request to proceed if all checks pass
  return NextResponse.next();
}

// Optimize middleware to only run on relevant paths (ignoring images, static files, etc.)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
