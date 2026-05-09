import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  const userCookie = request.cookies.get('user')
  let user = null
  
  if (userCookie?.value) {
    try {
      user = JSON.parse(userCookie.value)
    } catch (e) {
      // Invalid cookie
    }
  }

  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isPending = request.nextUrl.pathname === '/pending'
  const isAuth = request.nextUrl.pathname.startsWith('/auth')

  const isAuthenticated = !!user
  const isApproved = user?.approved ?? false

  if (isDashboard && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (isDashboard && isAuthenticated && !isApproved) {
    return NextResponse.redirect(new URL('/pending', request.url))
  }

  if (isAuth && isAuthenticated && isApproved) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isPending && isApproved) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/pending', '/auth/:path*'],
}