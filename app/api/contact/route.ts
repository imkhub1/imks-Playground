import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || !body.name?.trim() || !body.email?.trim() || !body.msg?.trim()) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "IMK's Playground <onboarding@resend.dev>",
      to: "kevindmadrigal@gmail.com",
      replyTo: body.email.trim(),
      subject: `[Contact] Message from ${body.name.trim()}`,
      html: `
        <p><strong>Name:</strong> ${body.name.trim()}</p>
        <p><strong>Email:</strong> ${body.email.trim()}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${body.msg.trim()}</p>
      `,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
