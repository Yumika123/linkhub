import { cn } from "@/lib/utils"

interface UserProfileProps {
    name: string
    image?: string | null
    subtitle?: string
    className?: string
}

export function UserProfile({
    name,
    image,
    subtitle,
    className
}: UserProfileProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            {image ? (
                <img
                    src={image}
                    alt={name}
                    className="w-10 h-10 rounded-full border-2 border-white/20 object-cover"
                />
            ) : (
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/60 font-medium">
                    {name.charAt(0).toUpperCase()}
                </div>
            )}
            <div className="flex-grow min-w-0">
                <div className="font-medium text-white text-sm truncate">
                    {name}
                </div>
                {subtitle && (
                    <div className="text-xs text-white/40 truncate">
                        {subtitle}
                    </div>
                )}
            </div>
        </div>
    )
}
