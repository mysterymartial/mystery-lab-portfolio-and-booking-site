import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Redirect /cv.pdf and uppercase .PDF to working CV URL
  if (pathname === '/cv.pdf' || pathname.endsWith('CV.PDF') || pathname.endsWith('cv.PDF')) {
    const url = request.nextUrl.clone()
    url.pathname = '/AGBAOSI%20BOLARINWA%20MINASU%20MYSTERY%20CV.pdf'
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/(.*)',
}
