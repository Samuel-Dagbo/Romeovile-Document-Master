import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-server'
import { getUserFromCookie } from '@/lib/auth'
import { z } from 'zod'

const userUpdateSchema = z.object({
  role: z.enum(['admin', 'pending', 'user']).optional(),
  approved: z.boolean().optional(),
  full_name: z.string().min(2).optional(),
})

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient()

    const user = await getUserFromCookie()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('Error in users GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()

    const user = await getUserFromCookie()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const result = userUpdateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({
        error: 'Validation error',
        details: result.error.errors
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .update(result.data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error in users PATCH:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
