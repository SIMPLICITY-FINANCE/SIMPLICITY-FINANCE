import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block dev/test/debug routes in production
  const blockedPaths = ['/dev/', '/test-auth', '/debug/'];
  const isBlockedPath = blockedPaths.some(path => pathname.startsWith(path));
  
  if (isBlockedPath && process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not Found' },
      { status: 404 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dev/:path*',
    '/test-auth',
    '/debug/:path*',
  ],
};
