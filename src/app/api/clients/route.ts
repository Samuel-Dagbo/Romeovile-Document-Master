import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-server'
import { getUserFromCookie } from '@/lib/auth'
import { z } from 'zod'

const clientSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  location: z.string().optional(),
  total_amount: z.number().min(0).optional().or(z.string().transform(val => Number(val) || 0)),
  balance: z.number().min(0).optional().or(z.string().transform(val => Number(val) || 0)),
  file_number: z.string().optional(),
  status: z.string().optional(),
  signup_date: z.string().optional(),
  plot_number: z.string().optional(),
  plot_size: z.number().optional().or(z.string().transform(val => Number(val) || null)),
  plot_location: z.string().optional(),
  site_plan: z.boolean().optional(),
  site_plan_done: z.boolean().optional(),
  site_plan_signed: z.boolean().optional(),
  number_of_indentures: z.number().optional().or(z.string().transform(val => Number(val) || null)),
  indenture_done: z.boolean().optional(),
  indenture_date: z.string().optional().nullable(),
  indenture_signed: z.boolean().optional(),
  deponent_signed: z.boolean().optional(),
  deponent_name: z.string().optional(),
  client_witness_name: z.string().optional(),
  boss_signed: z.boolean().optional(),
  court_signed: z.boolean().optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100', 10)
    const orderParam = searchParams.get('order') || 'created_at.desc'
    const id = searchParams.get('id')

    const supabase = getSupabaseAdminClient()

    const user = await getUserFromCookie()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!user.approved) {
      return NextResponse.json({ error: 'Account not approved' }, { status: 403 })
    }

    // Parse order parameter (e.g., "created_at.desc" -> { column: "created_at", ascending: false })
    const [orderColumn, sortOrder] = orderParam.split('.')
    const ascending = sortOrder !== 'desc'

    let query = supabase
      .from('clients')
      .select('*')
      .order(orderColumn || 'created_at', { ascending })

    if (id) {
      query = query.eq('id', id)
    } else {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching clients:', error)
      return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('Error in clients GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdminClient()

    const user = await getUserFromCookie()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!user.approved) {
      return NextResponse.json({ error: 'Account not approved' }, { status: 403 })
    }

    const body = await request.json()
    const result = clientSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({
        error: 'Validation error',
        details: result.error.errors
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('clients')
      .insert(result.data)
      .select()
      .single()

    if (error) {
      console.error('Error creating client:', error)
      return NextResponse.json({ 
        error: 'Failed to create client', 
        details: error.message,
        hint: 'Make sure all database columns exist'
      }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Error in clients POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()

    const user = await getUserFromCookie()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!user.approved) {
      return NextResponse.json({ error: 'Account not approved' }, { status: 403 })
    }

    const body = await request.json()
    const result = clientSchema.partial().safeParse(body)

    if (!result.success) {
      return NextResponse.json({
        error: 'Validation error',
        details: result.error.errors
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('clients')
      .update(result.data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating client:', error)
      return NextResponse.json({ 
        error: 'Failed to update client', 
        details: error.message,
        hint: 'Make sure all database columns exist'
      }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error in clients PATCH:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()

    const user = await getUserFromCookie()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!user.approved) {
      return NextResponse.json({ error: 'Account not approved' }, { status: 403 })
    }

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting client:', error)
      return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in clients DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
