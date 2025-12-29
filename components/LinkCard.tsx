import React from 'react'
import { ExternalLink, ArrowRight, Link as LinkIcon, Globe } from 'lucide-react'
import Image from "next/image"

interface LinkCardProps {
    title: string
    description?: string
    icon?: React.ReactNode
    image?: string | null
    href: string
    delay?: number
}

export function LinkCard({
    title,
    description,
    icon,
    image,
    href,
    delay = 0,
}: LinkCardProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col p-[--spacing-card-p] rounded-3xl glass-card transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:bg-white/20 hover:shadow-2xl hover:shadow-purple-500/20"
            style={{
                animationDelay: `${delay}ms`,
            }}
        >
            <div className="flex items-start justify-between mb-[--spacing-card-gap]">
                <div className="p-3 rounded-2xl bg-white/10 text-white group-hover:bg-white/20 transition-colors duration-300 overflow-hidden relative w-12 h-12 flex items-center justify-center">
                    {image ? (
                        <Image src={image} alt={title} fill className="object-cover" />
                    ) : (
                        icon || <Globe className="w-6 h-6" />
                    )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <ExternalLink className="w-5 h-5 text-white/70" />
                </div>
            </div>

            <h3 className="text-h3 font-weight-heading text-white mb-[--spacing-element-gap] tracking-tight">
                {title}
            </h3>
            {description && (
                <p className="text-white/70 text-small leading-relaxed mb-[--spacing-card-gap] flex-grow font-weight-body">
                    {description}
                </p>
            )}

            <div className="flex items-center text-white/90 text-small font-weight-subheading mt-auto group-hover:text-white transition-colors">
                <span>Visit Link</span>
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
        </a>
    )
}
