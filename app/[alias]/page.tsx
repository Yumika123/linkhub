import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { LinkList } from "@/components/LinkList"
import { PageHeader } from "@/components/PageHeader"

export const dynamic = "force-dynamic"

interface PublicPageProps {
    params: Promise<{ alias: string }>
}

export default async function PublicPage({ params }: PublicPageProps) {
    const paramsData = await params
    const alias = decodeURIComponent(paramsData.alias)

    const page = await prisma.page.findUnique({
        where: { alias },
        include: {
            owner: true,
            links: {
                orderBy: { order: "asc" }
            }
        }
    })

    if (!page || !page.isPublic) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-white">
            <PageHeader user={page.owner} title={page.alias} />
            <div className="py-8">
                <LinkList links={page.links} layout={page.type as "list" | "grid"} />
            </div>
        </div>
    )
}
