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
            className="block w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow hover:bg-gray-50 flex items-center gap-4"
        >
            {link.image && (
                <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                        src={link.image}
                        alt={link.title}
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
            )}
            <div className="flex-grow">
                <h3 className="font-medium text-gray-900">{link.title}</h3>
            </div>
        </a>
    )
}
