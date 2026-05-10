import { NextResponse } from 'next/server'
import { z } from 'zod'
import Mailjet from 'node-mailjet'
import { getSupabaseServerClient } from '@/lib/supabase-server'

const requestCodeSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const verifyCodeSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().min(6, 'Code must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = getSupabaseServerClient()

    if (body.action === 'request') {
      const result = requestCodeSchema.safeParse(body)
      if (!result.success) {
        return NextResponse.json({ error: 'Validation error', details: result.error.errors }, { status: 400 })
      }

      const { email } = result.data

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, email, full_name')
        .eq('email', email)
        .single()

      if (userError || !user) {
        return NextResponse.json({ message: 'If an account exists, a code will be sent.' }, { status: 200 })
      }

      const code = generateCode()
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

      await supabase
        .from('users')
        .update({ reset_code: code, reset_code_expires: expiresAt })
        .eq('id', user.id)

      const mailjet = new Mailjet({
        apiKey: process.env.MAILJET_APIKEY,
        apiSecret: process.env.MAILJET_SECRETKEY
      })

      await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
          From: { Email: 'romeovilleproperties20@gmail.com', Name: 'RomeoVille' },
          To: [{ Email: email, Name: user.full_name || 'User' }],
          Subject: 'Your Password Reset Code - RomeoVille',
          HTMLPart: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reset Code</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f1f5f9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,0.1);overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:40px 40px 35px;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="background:#ffffff;width:72px;height:72px;border-radius:20px;padding:4px;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
                      <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center;">
                        <span style="color:#ffffff;font-size:32px;font-weight:bold;">R</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:20px;">
                    <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">RomeoVille</h1>
                    <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.8);">Document Master</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 30px;">
              <h2 style="margin:0 0 20px;font-size:24px;font-weight:700;color:#0f172a;text-align:center;">Your Reset Code</h2>
              <p style="margin:0 0 16px;font-size:16px;color:#475569;line-height:1.6;">Hi ${user.full_name || 'there'},</p>
              <p style="margin:0 0 24px;font-size:16px;color:#475569;line-height:1.6;">Here is your password reset code:</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;padding:20px 40px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#ffffff;font-size:32px;font-weight:700;border-radius:14px;letter-spacing:8px;">${code}</div>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:14px;color:#94a3b8;text-align:center;">This code expires in 15 minutes</p>
              <div style="margin:24px 0 0;padding:16px;background:#fef3c7;border-radius:12px;border-left:4px solid #f59e0b;">
                <p style="margin:0;font-size:14px;color:#92400e;">If you didn't request this, please ignore this email.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:13px;color:#64748b;">© 2026 RomeoVille Document Master. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
        }]
      })

      return NextResponse.json({ message: 'If an account exists, a code will be sent.' }, { status: 200 })
    }

    if (body.action === 'reset') {
      const result = verifyCodeSchema.safeParse(body)
      if (!result.success) {
        return NextResponse.json({ error: 'Validation error', details: result.error.errors }, { status: 400 })
      }

      const { email, code, newPassword } = result.data

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, email, full_name, reset_code, reset_code_expires')
        .eq('email', email)
        .single()

      if (userError || !user) {
        return NextResponse.json({ error: 'Invalid email or code' }, { status: 400 })
      }

      if (!user.reset_code || user.reset_code !== code) {
        return NextResponse.json({ error: 'Invalid reset code' }, { status: 400 })
      }

      if (new Date(user.reset_code_expires) < new Date()) {
        return NextResponse.json({ error: 'Reset code has expired. Please request a new one.' }, { status: 400 })
      }

      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        password: newPassword
      })

      if (updateError) {
        console.error('Password update error:', updateError)
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
      }

      await supabase
        .from('users')
        .update({ reset_code: null, reset_code_expires: null })
        .eq('id', user.id)

      return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}