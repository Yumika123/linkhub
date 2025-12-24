import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { CreatePageForm } from "@/components/CreatePageForm"
import { SignOutButton } from "@/components/SignOutButton"
import { Prisma } from "@prisma/client"

type PageWithLinks = Prisma.PageGetPayload<{
    include: { links: true }
}>

export default async function DashboardPage() {
    const session = await auth()
    const cookieStore = await cookies()
    const editToken = cookieStore.get('linkhub_edit_token')?.value

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

    // If logged-in user has no pages, show create form
    if (session?.user && userPages.length === 0) {
        return (
            <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
                    <h1 className="text-2xl font-bold mb-4">Welcome to Linkhub!</h1>
                    <p className="text-gray-600 mb-6">Create your first page to get started.</p>
                    <CreatePageForm isAuthenticated={!!session?.user} />
                    {session && (
                        <div className="mt-6 flex justify-center">
                            <SignOutButton />
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Redirect to first page with alias-based URL
    redirect(`/dashboard/${userPages[0].alias}`)
}
