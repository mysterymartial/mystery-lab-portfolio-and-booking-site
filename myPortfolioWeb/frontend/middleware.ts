import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Redirect uppercase .PDF to lowercase .pdf (fixes 404 on case-sensitive servers)
  if (pathname.endsWith('CV.PDF') || pathname.endsWith('cv.PDF')) {
    const url = request.nextUrl.clone()
    url.pathname = '/cv.pdf'
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/(.*)',
}
