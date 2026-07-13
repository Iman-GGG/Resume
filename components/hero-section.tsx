import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import DecryptedText from "@/components/DecryptedText";
import { transitionVariants } from "@/lib/utils";
import LanyardWithControls from "@/components/lanyard-with-controls";

const roles = [
  { label: '产品经理' },
  { label: '信息系统项目管理师' },
  { label: 'AI 智能体应用师' },
]

export default function HeroSection() {
    return (
        <main className="overflow-x-hidden">
            <section className='relative lg:h-screen overflow-hidden'>
                <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44 lg:grid lg:grid-cols-2 lg:grid-rows-1 grid-cols-1 grid-rows-2">
                    <div className="relative mx-auto flex max-w-xl flex-col px-6 lg:block">
                        <div className="mx-auto max-w-2xl text-center lg:ml-0 lg:text-left">
                            <div className='mt-8 lg:mt-16'>
                                <DecryptedText
                                    text="先出发，路上缺啥补啥。"
                                    animateOn="view"
                                    revealDirection="start"
                                    sequential
                                    useOriginalCharsOnly={false}
                                    speed={70}
                                    className='font-mono text-muted-foreground bg-black rounded-md'
                                />
                            </div>
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h1"
                                className="max-w-2xl text-balance text-6xl font-semibold md:text-7xl xl:text-8xl">
                                耿艺曼
                            </TextEffect>
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h1"
                                className="max-w-2xl text-balance text-6xl font-semibold md:text-7xl xl:text-8xl">
                                Iman Geng
                            </TextEffect>
                            <TextEffect
                                per="line"
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                delay={0.5}
                                as="p"
                                className="mt-8 max-w-2xl text-pretty text-lg text-muted-foreground bg-black p-1 rounded-md">
                                5年BIM软件产品经理经验，独立AI开发者。做过建筑桌面端设计软件，也用AI自己做了股票量化平台和微信小程序。
                            </TextEffect>
                            <AnimatedGroup
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
                                className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:flex-row lg:justify-start"
                            >
                                {roles.map((role) => (
                                    <span key={role.label}
                                        className="inline-flex items-center rounded-full border border-border bg-background/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium">
                                        {role.label}
                                    </span>
                                ))}
                            </AnimatedGroup>
                            <AnimatedGroup
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
                                className="mt-10 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start"
                            >
                                <Button
                                    asChild
                                    size="lg"
                                    className="px-5 text-base">
                                    <Link href="#contact">
                                        <span className="text-nowrap">联系方式</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="ghost"
                                    className="px-5 text-base bg-black/30 backdrop-blur-sm hover:bg-black/40">
                                    <Link href="#projects">
                                        <span className="text-nowrap">查看项目</span>
                                    </Link>
                                </Button>
                            </AnimatedGroup>
                        </div>
                    </div>
                    <LanyardWithControls
                        position={[0, 0, 20]}
                        containerClassName='lg:absolute lg:top-0 lg:right-0 lg:w-1/2 relative w-full h-screen bg-radial lg:from-transparent lg:to-transparent from-muted to-background select-none'
                        defaultName="GENG YIMAN" />
                </div>

                <a
                    href="#projects"
                    aria-label="向下滚动"
                    className="absolute bottom-[46px] left-1/2 -translate-x-1/2 animate-bounce hidden lg:block"
                >
                    <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/20 p-1">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
                    </div>
                </a>
            </section>
        </main>
    )
}
