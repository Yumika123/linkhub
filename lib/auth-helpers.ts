import { auth } from "@/auth"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export type PageWithLinks = Prisma.PageGetPayload<{
    include: { links: true }
}>

/**
 * Get user pages for authenticated or anonymous users
 * Handles both session-based and token-based authentication
 */
export async function getUserPages() {
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

    return { session, userPages, editToken, user }
}

/**
 * Check if user has access (either authenticated or has valid edit token)
 */
export function hasAccess(session: any, editToken: string | undefined): boolean {
    return !!(session?.user || editToken)
}

/**
 * Check if anonymous user has valid page
 */
export function hasValidAnonymousPage(
    session: any,
    userPages: PageWithLinks[]
): boolean {
    return !session?.user && userPages.length === 0
}
