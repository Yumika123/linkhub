import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AddLinkForm } from "@/components/AddLinkForm"
import { EditableLink } from "@/components/EditableLink"
import { PageSettings } from "@/components/PageSettings"
import { SignOutButton } from "@/components/SignOutButton"
import { PageSelector } from "@/components/PageSelector"
import { cookies } from "next/headers"
import { CreatePageModal } from "@/components/CreatePageModal"
import { Prisma } from "@prisma/client"

type PageWithLinks = Prisma.PageGetPayload<{
    include: { links: true }
}>

interface DashboardPageProps {
    params: Promise<{ alias: string }>
}

export default async function DashboardAliasPage({ params }: DashboardPageProps) {
    const session = await auth()
    const cookieStore = await cookies()
    const editToken = cookieStore.get('linkhub_edit_token')?.value
    const { alias } = await params

    let userPages: PageWithLinks[] = []
    let user = null

    if (session?.user?.email) {
        // Logged in user flow
        user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                pages: {
                    include: { links: { orderBy: { order: "asc" } } }
                }
            }
        })
        if (user) userPages = user.pages
    } else if (editToken) {
        // Anonymous user flow
        const anonPage = await prisma.page.findUnique({
            where: { editToken },
            include: { links: { orderBy: { order: "asc" } } }
        })
        if (anonPage) {
            userPages = [anonPage]
        }
    }

    // Require either session or anon token
    if (!session && !editToken) {
        redirect("/")
    }

    // Anonymous users MUST have a valid page (editToken must match a page in DB)
    // If they have an editToken but no matching page, redirect them
    if (!session?.user && userPages.length === 0) {
        redirect("/")
    }

    // Find the requested page by alias
    const page = userPages.find((p) => p.alias === alias)

    // If page not found or user doesn't have access, redirect
    if (!page) {
        // Redirect to first page or home
        if (userPages.length > 0) {
            redirect(`/dashboard/${userPages[0].alias}`)
        } else {
            redirect("/dashboard")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Managing:</span>
                            {/* Only show selector if multiple pages */}
                            {userPages.length > 1 ? (
                                <PageSelector pages={userPages} currentPageAlias={page.alias} />
                            ) : (
                                <div className="font-mono bg-gray-200 px-2 py-1 rounded text-sm">{page.alias}</div>
                            )}
                            <a href={`/${page.alias}`} target="_blank" className="text-blue-600 hover:underline text-sm ml-2">View Live</a>
                        </div>
                        <PageSettings page={page} />
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        {session?.user ? (
                            <>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-sm md:text-base">{session.user.name}</span>
                                    {session.user.image && (
                                        <img src={session.user.image} alt={session.user.name || "User"} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm" />
                                    )}
                                </div>
                                <SignOutButton />
                            </>
                        ) : (
                            <div className="text-sm text-gray-500 italic">
                                Anonymous Mode
                            </div>
                        )}

                        {/* "Create New Page" - only for logged in users */}
                        {session?.user && (
                            <div className="mt-2">
                                <CreatePageModal />
                            </div>
                        )}
                    </div>
                </header>

                <main className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-lg font-semibold mb-4">Links for /{page.alias}</h2>

                        {page.links.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                No links yet. Click the + button to add one!
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {page.links.map((link) => (
                                    <EditableLink key={link.id} link={link} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                <AddLinkForm pageId={page.id} />
            </div>
        </div>
    )
}
