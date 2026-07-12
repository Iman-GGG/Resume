import React from 'react'
import Image from 'next/image'
import {TextEffect} from "@/components/motion-primitives/text-effect";
import {transitionVariants} from "@/lib/utils";
import {AnimatedGroup} from "@/components/motion-primitives/animated-group";
import { ExternalLink } from 'lucide-react';

const projects = [
  {
    name: '瞎芝麻',
    tag: '股票量化筛选平台',
    desc: '独立用 AI 开发的全栈股票量化筛选工具，覆盖选股、回测、信号监控等核心量化需求。',
    link: 'https://xiazhima.vercel.app',
    images: [1, 2, 3, 4, 5],
    tech: ['Next.js', 'Python', '量化交易'],
  },
  {
    name: '林则鼠',
    tag: '公益劝烟嘴替 · 微信小程序',
    desc: '公益戒烟倡导小程序，用趣味化的方式帮助公共场所劝阻吸烟。微信直接搜索「林则鼠」即可使用。',
    link: null,
    images: [1, 4, 5, 6, 7, 8],
    tech: ['微信小程序', '公益'],
  },
  {
    name: '作品集',
    tag: '作品集展示',
    desc: '基于 Next.js + Three.js，带 3D 物理吊牌的个人作品集网站。',
    link: 'https://gengyiman.vercel.app',
    images: null,
    tech: ['Next.js', 'Three.js', 'Vercel'],
  },
]

const certs = [
  { name: '信息系统项目管理师', icon: '📐' },
  { name: 'AI 智能体应用师', icon: '🤖' },
]

export default function Features() {
    return (
        <section id="projects" className="py-16 md:py-32 dark:bg-transparent bg-transparent">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center mb-12">
                    <TextEffect
                        triggerOnView
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        as="h2"
                        className="text-balance text-4xl font-semibold lg:text-5xl">
                        个人项目
                    </TextEffect>
                    <p className="text-muted-foreground mt-4 text-lg">独立用 AI 开发的作品</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <AnimatedGroup
                            key={project.name}
                            triggerOnView
                            variants={{
                                container: {
                                    visible: {
                                        transition: { staggerChildren: 0.05, delayChildren: 0.3 },
                                    },
                                },
                                ...transitionVariants,
                            }}
                        >
                            <div className="rounded-2xl border border-border bg-card/50 overflow-hidden h-full flex flex-col">
                                {/* Screenshots */}
                                {project.images && project.name === '瞎芝麻' && (
                                    <div className="p-3 bg-muted/30 space-y-2">
                                        <Image
                                            src={`/${project.name}1.png`}
                                            alt={`${project.name} 主图`}
                                            width={800}
                                            height={400}
                                            className="rounded-lg w-full h-auto"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            {project.images.filter(n => n !== 1).map((n) => (
                                                <Image
                                                    key={n}
                                                    src={`/${project.name}${n}.png`}
                                                    alt={`${project.name} 截图 ${n}`}
                                                    width={400}
                                                    height={200}
                                                    className="rounded-lg w-full h-auto"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {project.images && project.name !== '瞎芝麻' && (
                                    <div className="grid grid-cols-3 gap-2 p-3 bg-muted/30">
                                        {project.images.map((n) => (
                                            <Image
                                                key={n}
                                                src={`/${project.name}${n}.png`}
                                                alt={`${project.name} 截图 ${n}`}
                                                width={160}
                                                height={284}
                                                className="rounded-lg w-full h-auto"
                                            />
                                        ))}
                                    </div>
                                )}
                                {/* Placeholder for projects without screenshots */}
                                {!project.images && (
                                    <div className="h-40 bg-gradient-to-br from-purple-900/30 to-rose-900/30 flex items-center justify-center">
                                        <span className="text-5xl opacity-30">🎯</span>
                                    </div>
                                )}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-xl">{project.name}</h3>
                                        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{project.tag}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4 flex-1">{project.desc}</p>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {project.tech.map((t) => (
                                            <span key={t} className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{t}</span>
                                        ))}
                                    </div>
                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-auto">
                                            <ExternalLink className="size-3" />
                                            xiazhima.vercel.app
                                        </a>
                                    )}
                                    {!project.link && (
                                        <p className="text-xs text-muted-foreground mt-auto">微信搜索「林则鼠」即可使用</p>
                                    )}
                                </div>
                            </div>
                        </AnimatedGroup>
                    ))}
                </div>

                {/* Certifications */}
                <div className="mt-20 relative rounded-2xl overflow-hidden bg-background">
                    <Image
                        src="/创世纪butAI.jpg"
                        alt="背景"
                        fill
                        className="object-cover mix-blend-difference opacity-50"
                    />
                    <div className="relative py-16 px-6">
                        <div className="text-center mb-8">
                            <TextEffect
                                triggerOnView
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h2"
                                className="text-balance text-3xl font-semibold lg:text-4xl">
                                专业认证
                            </TextEffect>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {certs.map((cert) => (
                                <div key={cert.name}
                                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 backdrop-blur-sm px-6 py-4">
                                    <span className="text-2xl">{cert.icon}</span>
                                    <span className="font-medium">{cert.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
