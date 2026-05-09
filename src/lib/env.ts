import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
})

function validateEnv() {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    const errors = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    console.error('Invalid environment variables:', errors)
    throw new Error(`Invalid environment variables: ${errors}`)
  }

  return parsed.data
}

export const env = validateEnv()
