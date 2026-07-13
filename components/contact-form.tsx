"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Send } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error()

      toast.success("消息已发送！", {
        description: "感谢你的留言，我会尽快回复。",
      })
      form.reset()
    } catch {
      toast.error("发送失败", {
        description: "请稍后重试，或直接发送邮件给我。",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-purple-500/50 group">
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-25 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200" />

        <div className="relative">
          <h3 className="text-xl font-semibold mb-6">发一条信息给我吧</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="你的名字"
              required
              className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 placeholder:text-muted-foreground"
            />
            <input
              name="email"
              type="email"
              placeholder="你的邮箱"
              required
              className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 placeholder:text-muted-foreground"
            />
            <input
              name="subject"
              type="text"
              placeholder="主题"
              required
              className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 placeholder:text-muted-foreground"
            />
            <textarea
              name="message"
              placeholder="你的消息..."
              required
              rows={4}
              className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 placeholder:text-muted-foreground resize-none"
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 border-0"
            >
              {isSubmitting ? (
                "发送中..."
              ) : (
                <>
                  发送消息
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
