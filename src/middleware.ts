import { NextRequest, NextResponse } from 'next/server';
import type { Role } from '@/types';

// Role-protected route prefixes. Matched with trailing slash to avoid
const ROLE_ROUTES: Array<{ prefix: string; role: Role }> = [
  { prefix: '/buyer/', role: 'buyer' },
  { prefix: '/seller/', role: 'seller' },
  { prefix: '/admin/', role: 'admin' },
];





const AUTH_ROUTES = ['/login', '/signup', '/seller-setup'];
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authCookie = req.cookies.get('evyn-role')?.value as Role | undefined;

  // Redirect already-logged-in users away from auth pages
  if (authCookie && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL(`/${authCookie}/dashboard`, req.url));
  }

  for (const { prefix, role } of ROLE_ROUTES) {
    if (pathname === prefix.slice(0, -1) || pathname.startsWith(prefix)) {
      if (!authCookie) {
        const next = encodeURIComponent(pathname);
        return NextResponse.redirect(new URL(`/login?next=${next}`, req.url));
      }
      if (authCookie !== role) {
        return NextResponse.redirect(new URL(`/${authCookie}/dashboard`, req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/buyer/:path*',
    '/seller/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
    '/seller-setup',
  ],
};
