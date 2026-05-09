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

async function setupDatabase() {
  console.log('🔧 Setting up database schema...\n')

  // Check users table
  console.log('Checking users table...')
  try {
    const { data, error } = await adminClient.from('users').select('id').limit(1)
    if (error) throw error
    console.log('  ✓ Users table exists')
  } catch (e) {
    console.log('  ⚠ Users table may need to be created manually')
  }

  // Check clients table
  console.log('Checking clients table...')
  try {
    const { data, error } = await adminClient.from('clients').select('id').limit(1)
    if (error) throw error
    console.log('  ✓ Clients table exists')
  } catch (e) {
    console.log('  ⚠ Clients table may need to be created manually')
  }

  console.log('\n✅ Database schema check complete!')
  console.log('\n📋 Run the SQL in src/scripts/schema.sql in your Supabase SQL Editor to create/verify tables.')
}

setupDatabase()
  .then(() => console.log('\n✨ Setup check complete!'))
  .catch(console.error)