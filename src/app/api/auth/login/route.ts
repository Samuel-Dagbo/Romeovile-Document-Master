import { NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = loginSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({
        error: 'Validation error',
        details: result.error.errors
      }, { status: 400 })
    }

    const { email, password } = result.data

    try {
      const user = await authenticateUser(email, password)
      
      const response = NextResponse.json({ user })
      
      response.cookies.set('user', JSON.stringify(user), {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      
      return response
    } catch (error: any) {
      if (error.message === 'PENDING_APPROVAL') {
        return NextResponse.json({ error: 'Account pending approval' }, { status: 403 })
      }
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}