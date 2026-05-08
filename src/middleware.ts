import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isPending = request.nextUrl.pathname === '/pending'
  const isAuth = request.nextUrl.pathname.startsWith('/auth')

  // Check user from cookie
  const userCookie = request.cookies.get('user')
  let user = null
  
  if (userCookie?.value) {
    try {
      user = JSON.parse(decodeURIComponent(userCookie.value))
    } catch {
      // Try without decode
      try {
        user = JSON.parse(userCookie.value)
      } catch {}
    }
  }

  // Redirect unauthenticated users to login
  if (isDashboard && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Redirect pending users to pending page
  if (isDashboard && user && !user.approved) {
    return NextResponse.redirect(new URL('/pending', request.url))
  }

  // Redirect authenticated users away from auth pages
  if (isAuth && user && user.approved) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect approved users from pending page
  if (isPending && user?.approved) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/pending', '/auth/:path*'],
}