import { SkillBadge } from "@/components/skill-badge"
import { TextEffect } from "@/components/motion-primitives/text-effect"

const skills = [
  { name: "CAD、SU", level: 98 },
  { name: "产品规划与设计", level: 95 },
  { name: "Codex、VSCode+AI", level: 80 },
  { name: "Revit、Archicad", level: 90 },
  { name: "Axure、Xmind、Figma、Adobe", level: 95 },
  { name: "PKPMBIM、GNA、Dougong", level: 95 },
  { name: "无人机", level: 80 },
  { name: "雕刻机", level: 80 },
  { name: "3D打印机", level: 75 },
  { name: "WPS", level: 70 },
  { name: "Github", level: 65 },
  { name: "项目管理", level: 60 },
]

export default function SkillsSection() {
  return (
    <section id="skills" className="relative py-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-blue-500 opacity-10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-500 opacity-10 blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <TextEffect
            triggerOnView
            preset="fade-in-blur"
            speedSegment={0.3}
            as="h2"
            className="text-balance text-3xl font-semibold lg:text-4xl">
            我的技能
          </TextEffect>
          <p className="text-muted-foreground text-lg mt-4">Technologies I work with</p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {skills.map((skill) => (
            <SkillBadge key={skill.name} name={skill.name} level={skill.level} />
          ))}
        </div>
      </div>
    </section>
  )
}
