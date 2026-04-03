import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      )
    }

    await resend.emails.send({
      from:    'Portfolio Contact <onboarding@resend.dev>',
      to:      'matejcikmathias@gmail.com',
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text:    `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#03060f;color:#e2eaf4;border-radius:12px;">
          <p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#3d5a7a;margin-bottom:24px;">New message from portfolio</p>
          <h2 style="font-size:20px;font-weight:700;margin-bottom:4px;color:#e2eaf4;">${subject}</h2>
          <p style="font-size:13px;color:#38bdf8;margin-bottom:24px;">${name} &lt;${email}&gt;</p>
          <div style="border-top:1px solid rgba(99,179,237,0.12);padding-top:20px;">
            <p style="font-size:14px;line-height:1.75;color:#7a9bbf;">${message.replace(/\n/g, '<br/>')}</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact]', err)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}