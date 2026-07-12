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
  },
  {
    company: '广联达',
    product: 'GNA 数维建筑',
    period: '建筑专业桌面端设计软件',
    highlights: ['指标计算专项', '出图专项'],
  },
  {
    company: '万科 · 万翼',
    product: 'dougong',
    period: '建筑专业桌面端设计软件',
    highlights: ['BIM 软件通用能力全链路设计'],
  },
]

export default function Agenda() {
    return (
        <section id="experience" className="relative">
            <Image
                src="/创世纪butAI.jpg"
                alt="背景"
                fill
                className="object-cover mix-blend-difference opacity-50"
            />
            <div className="relative scroll-py-16 py-16 md:scroll-py-32 md:py-32">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center mb-12">
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
                                        staggerChildren: 0.1,
                                        delayChildren: 0.5,
                                    },
                                },
                            },
                            ...transitionVariants,
                        }}
                        className="flex flex-col md:flex-row items-stretch justify-center gap-4"
                    >
                        {experiences.map((exp, i) => (
                            <React.Fragment key={exp.product}>
                                <div className="flex-1 max-w-80 rounded-xl bg-white border border-gray-200 p-6 text-black shadow-sm h-full">
                                    <div className="flex items-baseline justify-between gap-2 mb-3">
                                        <span className="font-semibold text-lg">{exp.product}</span>
                                        <span className="text-gray-400 font-mono text-xs shrink-0">{exp.period}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-3">{exp.company}</p>
                                    <ul className="space-y-1">
                                        {exp.highlights.map((h) => (
                                            <li key={h} className="text-sm flex items-start gap-2">
                                                <span className="text-gray-300 mt-1 shrink-0">▸</span>
                                                <span>{h}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {i < experiences.length - 1 && (
                                    <div className="flex items-center justify-center shrink-0 px-1 py-2 md:py-0">
                                        <svg width="28" height="24" viewBox="0 0 28 24" className="text-gray-400">
                                            <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="1.5" />
                                            <polyline points="18,6 24,12 18,18" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </AnimatedGroup>
                </div>
            </div>
        </section>
    )
}
