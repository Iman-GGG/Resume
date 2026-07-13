"use client"

import { motion } from "motion/react"

interface SkillBadgeProps {
  name: string
  level: number
}

export function SkillBadge({ name, level }: SkillBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="relative h-full overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-zinc-400/50">
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-white/5 to-zinc-400/5 opacity-25 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200" />

        <div className="relative">
          <div className="mb-4 text-center text-lg font-medium">
            {name}
          </div>

          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-zinc-300 to-zinc-500"
              initial={{ width: 0 }}
              whileInView={{ width: `${level}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            />
          </div>

          <div className="mt-2 text-right text-sm text-muted-foreground">
            {level}%
          </div>
        </div>
      </div>
    </motion.div>
  )
}
