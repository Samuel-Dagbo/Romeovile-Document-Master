import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST() {
  try {
    const resend = new Resend(process.env.RESEND_API || process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: 'RomeoVille <onboarding@resend.dev>',
      to: 'samueldagbo50@gmail.com',
      subject: 'Test Email - RomeoVille',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email to verify Resend is working correctly.</p>
        <p>Best regards,<br/>RomeoVille</p>
      `,
    })

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Test email error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}