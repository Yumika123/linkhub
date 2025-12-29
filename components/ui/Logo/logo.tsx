import { cn } from "@/lib/utils"

interface LogoProps {
    className?: string
    letter?: string
    text?: string
}

export function Logo({
    className,
    letter = "L",
    text = "LinkHub"
}: LogoProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xl font-bold text-white">
                {letter}
            </div>
            {text && <span className="text-xl font-bold text-white">{text}</span>}
        </div>
    )
}
