import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })
import crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function updatePassword() {
  const passwordHash = crypto.createHash('sha256').update('admin123').digest('hex')
  
  const { error } = await adminClient
    .from('users')
    .update({ password: passwordHash })
    .eq('email', 'admin@romeoville.com')

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Password updated successfully')
  }
}

updatePassword()