import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session')?.value;
  const isAccessingAdmin = request.nextUrl.pathname.startsWith('/admin');

  if (isAccessingAdmin && session !== 'authenticated') {
    // Redirect unauthenticated users to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Only run middleware on admin routes to keep public site blazing fast
export const config = {
  matcher: '/admin/:path*',
};
