import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "所有字段都是必填的" }, { status: 400 })
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: ["767189834@qq.com"],
        reply_to: email,
        subject: `[Portfolio] ${subject}`,
        html: `
          <h2>新的留言</h2>
          <p><strong>姓名：</strong>${name}</p>
          <p><strong>邮箱：</strong>${email}</p>
          <p><strong>主题：</strong>${subject}</p>
          <p><strong>消息：</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error("Resend error:", err)
      return NextResponse.json({ error: "发送失败" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
