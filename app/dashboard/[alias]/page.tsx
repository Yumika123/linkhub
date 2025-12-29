import { redirect } from "next/navigation"
import { getUserPages, hasAccess, hasValidAnonymousPage } from "@/lib/auth-helpers"
import { AddLinkForm } from "@/components/AddLinkForm"
import { SignOutButton } from "@/components/SignOutButton"
import { DeleteLinkButton } from "@/components/DeleteLinkButton"
import { DashboardClient } from "./DashboardClient"

interface DashboardPageProps {
    params: Promise<{ alias: string }>
}

export default async function DashboardAliasPage({ params }: DashboardPageProps) {
    const { alias } = await params
    const { session, userPages, editToken } = await getUserPages()

    // Require either session or anon token
    if (!hasAccess(session, editToken)) {
        redirect("/")
    }

    // Anonymous users MUST have a valid page
    if (hasValidAnonymousPage(session, userPages)) {
        redirect("/")
    }

    // Find the requested page by alias
    const page = userPages.find((p) => p.alias === alias)

    // If page not found or user doesn't have access, redirect
    if (!page) {
        if (userPages.length > 0) {
            redirect(`/dashboard/${userPages[0].alias}`)
        } else {
            redirect("/dashboard")
        }
    }

    return (
        <DashboardClient
            page={page}
            userPages={userPages}
            session={session}
        />
    )
}
