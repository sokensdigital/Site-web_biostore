import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Kept as a plain constant (not imported from lib/auth.ts) so the edge
// proxy bundle doesn't pull in bcryptjs/next-headers.
const sessionCookieName = 'biostore-admin-session'

export const config = {
  matcher: ['/admin/:path*'],
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/login') return NextResponse.next()

  const token = request.cookies.get(sessionCookieName)?.value
  const secret = process.env.SESSION_SECRET

  if (token && secret) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret))
      return NextResponse.next()
    } catch {
      // fall through to redirect
    }
  }

  const loginUrl = new URL('/admin/login', request.url)
  return NextResponse.redirect(loginUrl)
}
