import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Block /dev/* routes in production
  if (pathname.startsWith('/dev/')) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Not Found' },
        { status: 404 }
      );
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/dev/:path*',
    '/admin/:path*',
  ],
};
