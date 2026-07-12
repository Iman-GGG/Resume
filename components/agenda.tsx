import {TextEffect} from "@/components/motion-primitives/text-effect";
import React from "react";
import Image from "next/image";
import {transitionVariants} from "@/lib/utils";
import {AnimatedGroup} from "@/components/motion-primitives/animated-group";

const experiences = [
  {
    company: '中国建研院 · 构力科技',
    product: 'PKPM-BIM',
    period: '建筑专业桌面端设计软件',
    highlights: ['基础功能设计，覆盖建筑建模核心流程'],
    color: 'from-blue-500/10 to-blue-500/5',
  },
  {
    company: '广联达',
    product: 'GNA 数维建筑',
    period: '建筑专业桌面端设计软件',
    highlights: ['指标计算专项', '出图专项'],
    color: 'from-emerald-500/10 to-emerald-500/5',
  },
  {
    company: '万科 · 万翼',
    product: 'dougong',
    period: '建筑专业桌面端设计软件',
    highlights: ['BIM 软件通用能力全链路设计'],
    color: 'from-purple-500/10 to-purple-500/5',
  },
]

export default function Agenda() {
    return (
        <section id="experience">
            {/* Work Experience */}
            <div className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="grid gap-y-12 px-2 lg:grid-cols-[1fr_auto]">
                        <div className="text-center lg:text-left">
                            <TextEffect
                                triggerOnView
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h2"
                                className="mb-4 text-3xl font-semibold md:text-4xl">
                                工作经历
                            </TextEffect>
                            <p className="text-muted-foreground text-lg">三款 BIM 建筑桌面端设计软件</p>
                        </div>

                        <AnimatedGroup
                            triggerOnView
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}
                            className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0"
                        >
                            {experiences.map((exp) => (
                                <div key={exp.product} className="py-6">
                                    <div className={`rounded-xl bg-gradient-to-br ${exp.color} border border-border/50 p-5`}>
                                        <div className="flex items-baseline justify-between gap-4 mb-3">
                                            <span className="font-semibold text-lg">{exp.product}</span>
                                            <span className="text-muted-foreground font-mono text-xs shrink-0">{exp.period}</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-3">{exp.company}</p>
                                        <ul className="space-y-1">
                                            {exp.highlights.map((h) => (
                                                <li key={h} className="text-sm flex items-start gap-2">
                                                    <span className="text-muted-foreground mt-1">▸</span>
                                                    <span>{h}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </AnimatedGroup>
                    </div>
                </div>
            </div>

            {/* Background image below work experience */}
            <div className="relative w-full h-96 overflow-hidden">
                <Image
                    src="/创世纪butAI.jpg"
                    alt="背景"
                    fill
                    className="object-cover mix-blend-difference opacity-50"
                />
            </div>
        </section>
    )
}
