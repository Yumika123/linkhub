import { User } from "@prisma/client"
import Image from "next/image"

interface PageHeaderProps {
    user: User | null
    title?: string
    description?: string
}

export function PageHeader({ user, title, description }: PageHeaderProps) {
    return (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            {user?.image && (
                <div className="relative w-24 h-24 mb-4">
                    <Image
                        src={user.image}
                        alt={user.name || "User"}
                        fill
                        className="rounded-full object-cover border-4 border-white shadow-lg"
                    />
                </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {title || user?.name || "My Links"}
            </h1>
            {description && (
                <p className="text-gray-600 max-w-md">{description}</p>
            )}
        </div>
    )
}
