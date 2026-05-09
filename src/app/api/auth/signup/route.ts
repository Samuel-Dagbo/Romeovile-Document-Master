import { NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  full_name: z.string().min(2, 'Full name is required'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = signupSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({
        error: 'Validation error',
        details: result.error.errors
      }, { status: 400 })
    }

    const { email, password, full_name } = result.data

    try {
      const user = await createUser(email, password, full_name)
      return NextResponse.json({
        user,
        message: 'Account created successfully. Pending admin approval.',
      }, { status: 201 })
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}