import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env } from './env'

// Server-safe client for use in server components and API routes
export function getSupabaseServerClient() {
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Server client with cookies for session management (Route Handlers, Server Actions)
export function getSupabaseRouteHandlerClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {
          // Route handlers can set cookies via response headers if needed
        },
        remove() {
          // Route handlers can remove cookies via response headers if needed
        },
      },
    }
  )
}

// Admin client - ONLY use in trusted server contexts (e.g., scheduled jobs, admin APIs with proper auth)
export function getSupabaseAdminClient() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
  }
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
