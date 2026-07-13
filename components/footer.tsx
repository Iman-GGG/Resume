import Link from 'next/link'
import Image from 'next/image'
import React from "react";
import { Github, Mail, Phone } from 'lucide-react'
import ContactForm from "@/components/contact-form"

const links = [
    { title: 'GitHub', href: 'https://github.com/Iman-GGG' },
    { title: '瞎芝麻', href: 'https://xiazhima.vercel.app' },
    { title: 'Vercel', href: 'https://vercel.com/' },
]

export default function FooterSection() {
    return (
        <footer id="contact" className="py-16 md:py-32 border-t border-border">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-semibold mb-4">联系方式</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-10 items-start">
                    {/* 左侧：联系信息 */}
                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex flex-col items-center md:items-start gap-6 mb-8">
                            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                <Mail className="size-4" />
                                <a href="mailto:767189834@qq.com" className="font-mono text-sm">767189834@qq.com</a>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                <Phone className="size-4" />
                                <a href="tel:17815381850" className="font-mono text-sm">17815381850</a>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                <Github className="size-4" />
                                <a href="https://github.com/Iman-GGG" target="_blank" rel="noopener noreferrer" className="font-mono text-sm">Iman-GGG</a>
                            </div>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-border">
                            <Image
                                src="/wechatscan.jpg"
                                alt="微信二维码"
                                width={160}
                                height={160}
                                className="rounded-lg"
                            />
                            <p className="text-xs text-muted-foreground text-center mt-2 font-mono">微信扫码</p>
                        </div>
                    </div>

                    {/* 右侧：留言表单 */}
                    <ContactForm />
                </div>

                <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            target={link.href.startsWith('http') ? '_blank' : undefined}
                            className="text-muted-foreground hover:text-primary block duration-150">
                            <span>{link.title}</span>
                        </Link>
                    ))}
                </div>
                <span className="text-muted-foreground block text-center text-sm font-mono mt-8">
                    Iman Geng / 耿艺曼 · Built with v0 & Vercel
                </span>
            </div>
        </footer>
    )
}
