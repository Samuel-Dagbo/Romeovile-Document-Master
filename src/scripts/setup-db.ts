import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function setupAdmin() {
  console.log('Setting up admin user...')

  const { data: existingAuth, error: listError } = await adminClient.auth.admin.listUsers()
  if (listError) {
    console.error('Error listing users:', listError)
    return
  }

  const adminAuthUser = existingAuth?.users.find(u => u.email === 'admin@romeoville.com')

  if (adminAuthUser) {
    console.log('Admin user already exists in Auth:', adminAuthUser.id)
    
    const { data: existingProfile } = await adminClient
      .from('users')
      .select('*')
      .eq('id', adminAuthUser.id)
      .single()

    if (existingProfile) {
      console.log('Admin profile already exists')
      return
    }

    const { error: profileError } = await adminClient
      .from('users')
      .insert({
        id: adminAuthUser.id,
        email: 'admin@romeoville.com',
        full_name: 'System Admin',
        role: 'admin',
        approved: true,
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
    } else {
      console.log('Admin profile created successfully')
    }
    return
  }

  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: 'admin@romeoville.com',
    password: 'admin123',
    email_confirm: true,
  })

  if (authError) {
    console.error('Error creating auth user:', authError)
    return
  }

  console.log('Auth user created:', authData.user?.id)

  const { error: profileError } = await adminClient
    .from('users')
    .insert({
      id: authData.user?.id,
      email: 'admin@romeoville.com',
      full_name: 'System Admin',
      role: 'admin',
      approved: true,
    })

  if (profileError) {
    console.error('Error creating profile:', profileError)
  } else {
    console.log('Admin profile created successfully')
  }
}

setupAdmin()
  .then(() => console.log('Setup complete'))
  .catch(console.error)