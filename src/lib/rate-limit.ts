import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface RateLimitStore {
  [ip: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}
const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 100 // 100 requests per minute

function cleanStore() {
  const now = Date.now()
  for (const [ip, data] of Object.entries(store)) {
    if (now > data.resetTime) {
      delete store[ip]
    }
  }
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.ip || 'unknown'
}

export function rateLimit(request: NextRequest) {
  // Skip rate limiting in development
  if (process.env.NODE_ENV === 'development') {
    return null
  }

  cleanStore()

  const ip = getClientIp(request)
  const now = Date.now()

  if (!store[ip] || now > store[ip].resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    }
    return null
  }

  store[ip].count++

  if (store[ip].count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  return null
}
