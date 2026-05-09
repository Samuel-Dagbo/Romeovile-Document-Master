import { getSupabaseServerClient } from './supabase-server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export interface User {
  id: string
  email: string
  full_name: string | null
  role: string
  approved: boolean
}

export async function getUserFromCookie(): Promise<User | null> {
  const cookieStore = cookies()
  const userCookie = cookieStore.get('user')
  
  if (!userCookie?.value) {
    return null
  }
  
  try {
    return JSON.parse(userCookie.value) as User
  } catch {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const supabase = getSupabaseServerClient()
  
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    return null
  }

  const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
  if (user.password !== passwordHash) {
    return null
  }

  if (!user.approved) {
    throw new Error('PENDING_APPROVAL')
  }

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword as User
}

export async function createUser(email: string, password: string, fullName: string): Promise<User> {
  const supabase = getSupabaseServerClient()
  
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
  
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) {
    throw new Error('Email already registered')
  }

  const { data: user, error } = await supabase
    .from('users')
    .insert({
      email,
      password: passwordHash,
      full_name: fullName,
      role: 'pending',
      approved: false,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword as User
}