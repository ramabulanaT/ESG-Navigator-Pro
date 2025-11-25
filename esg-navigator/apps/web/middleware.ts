import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Multi-Domain Routing Middleware
 *
 * Routes requests based on hostname to appropriate division:
 * - tis-holdings.com      → (marketing)  Corporate/Landing
 * - esgnavigator.ai       → (education)  Education Division
 * - tis-intellimat.net    → (enterprise) Enterprise Division
 */

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Extract the actual hostname (remove port for local dev)
  const actualHostname = hostname.split(':')[0];

  console.log(`[Middleware] Request to: ${actualHostname}${url.pathname}`);

  // Skip middleware for static files and API routes
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/favicon.ico') ||
    url.pathname.startsWith('/robots.txt')
  ) {
    return NextResponse.next();
  }

  // ============================================
  // TIS HOLDINGS - Corporate/Marketing Site
  // Domain: tis-holdings.com
  // ============================================
  if (
    actualHostname === 'tis-holdings.com' ||
    actualHostname === 'www.tis-holdings.com' ||
    actualHostname === 'localhost' // Default for local dev
  ) {
    // Root path → Landing page
    if (url.pathname === '/') {
      return NextResponse.rewrite(new URL('/marketing/page', request.url));
    }

    // If already in marketing, continue
    if (url.pathname.startsWith('/marketing')) {
      return NextResponse.next();
    }

    // Rewrite all other paths to marketing
    url.pathname = `/marketing${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // ============================================
  // ESG NAVIGATOR - Education Division
  // Domain: esgnavigator.ai
  // ============================================
  if (
    actualHostname === 'esgnavigator.ai' ||
    actualHostname === 'www.esgnavigator.ai' ||
    actualHostname.includes('esgnavigator') // For staging: staging.esgnavigator.ai
  ) {
    // Root path → Assessments (main product)
    if (url.pathname === '/') {
      url.pathname = '/education/assessments';
      return NextResponse.rewrite(url);
    }

    // If already in education, continue
    if (url.pathname.startsWith('/education')) {
      return NextResponse.next();
    }

    // Rewrite all other paths to education
    url.pathname = `/education${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // ============================================
  // TIS-INTELLIMAT - Enterprise Division
  // Domain: tis-intellimat.net
  // ============================================
  if (
    actualHostname === 'tis-intellimat.net' ||
    actualHostname === 'www.tis-intellimat.net' ||
    actualHostname.includes('intellimat') // For staging: staging.tis-intellimat.net
  ) {
    // Root path → Dashboard (main product)
    if (url.pathname === '/') {
      url.pathname = '/enterprise/dashboard';
      return NextResponse.rewrite(url);
    }

    // If already in enterprise, continue
    if (url.pathname.startsWith('/enterprise')) {
      return NextResponse.next();
    }

    // Rewrite all other paths to enterprise
    url.pathname = `/enterprise${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // ============================================
  // FALLBACK - Default to marketing
  // ============================================
  if (url.pathname === '/') {
    return NextResponse.rewrite(new URL('/marketing/page', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt (static files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
};
