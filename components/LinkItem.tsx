import { Link as LinkModel } from "@prisma/client"
import Image from "next/image"

interface LinkItemProps {
    link: LinkModel
    variant?: "list" | "grid"
}

export function LinkItem({ link, variant = "list" }: LinkItemProps) {
    if (variant === "grid") {
        return (
            <a
                href={link.url}
                target={link.target}
                rel="noopener noreferrer"
                className="block relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity border border-gray-200 group"
            >
                {link.image ? (
                    <Image
                        src={link.image}
                        alt={link.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50 font-medium p-2 text-center text-sm">
                        {link.title}
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {link.title}
                </div>
            </a>
        )
    }

    return (
        <a
            href={link.url}
            target={link.target}
            rel="noopener noreferrer"
            className="block w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-4 group"
        >
            {link.image ? (
                <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                        src={link.image}
                        alt={link.title}
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>
            ) : (
                <div className="w-12 h-12 flex-shrink-0 bg-white/10 rounded-lg flex items-center justify-center text-white/50">
                    <span className="text-xl">#</span>
                </div>
            )}
            <div className="flex-grow">
                <h3 className="font-medium text-white group-hover:text-blue-200 transition-colors">{link.title}</h3>
                <p className="text-sm text-white/40 truncate">{link.url}</p>
            </div>
        </a>
    )
}
