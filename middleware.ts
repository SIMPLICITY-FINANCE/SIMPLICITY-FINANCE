import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block /dev/* routes in production
  if (pathname.startsWith('/dev/')) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Not Found' },
        { status: 404 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dev/:path*',
  ],
};
