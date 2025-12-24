import { Link as LinkModel } from "@prisma/client"
import { LinkItem } from "./LinkItem"

interface LinkListProps {
    links: LinkModel[]
    layout?: "list" | "grid"
}

export function LinkList({ links, layout = "list" }: LinkListProps) {
    if (!links || links.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No links yet. Add one to get started!
            </div>
        )
    }

    const gridClasses = "grid grid-cols-2 md:grid-cols-3 gap-4"
    const listClasses = "flex flex-col gap-3"

    return (
        <div className={`w-full max-w-4xl mx-auto px-4 ${layout === "grid" ? gridClasses : listClasses}`}>
            {links.map((link) => (
                <LinkItem key={link.id} link={link} variant={layout} />
            ))}
        </div>
    )
}
