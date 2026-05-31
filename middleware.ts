import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || '/admin';
  const pathname = request.nextUrl.pathname;

  // Protect the real /admin path if a custom path is set
  if (pathname.startsWith('/admin') && adminPath !== '/admin') {
    return NextResponse.rewrite(new URL('/_not-found', request.url));
  }

  // Rewrite the custom secret path to /admin internally
  if (pathname.startsWith(adminPath) && adminPath !== '/admin') {
    const newPath = pathname.replace(adminPath, '/admin');
    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
