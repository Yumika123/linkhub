"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import crypto from "crypto"
import { Prisma } from "@prisma/client"

import { cookies } from "next/headers"

export async function createPage(prevState: any, formData: FormData) {
    const session = await auth()

    // Custom alias is only allowed for logged in users
    // For anonymous users, we always generate a UUID alias
    let alias = formData.get("alias") as string | null

    if (!session?.user) {
        // Anonymous users always get a random UUID
        alias = crypto.randomUUID()
    } else if (!alias || alias.trim() === "") {
        // Logged in users get UUID if they don't provide an alias
        alias = crypto.randomUUID()
    }

    // TODO: Handle error
    if (!alias) {
        return { error: "Alias could not be generated." }
    }

    // Validation for custom alias
    const isUserProvidedAlias = session?.user && formData.get("alias") !== null && formData.get("alias") === alias;
    if (isUserProvidedAlias) {
        if (alias.length < 3) {
            return { error: "Alias must be at least 3 characters" }
        }
        if (alias.length > 50) {
            return { error: "Alias must be at most 50 characters" }
        }
        // Only allow Latin letters, digits, hyphens, and underscores
        const aliasRegex = /^[a-zA-Z0-9_-]+$/
        if (!aliasRegex.test(alias)) {
            return { error: "Alias can only contain Latin letters, digits, hyphens, and underscores" }
        }
    }

    // Check uniqueness
    const existing = await prisma.page.findUnique({ where: { alias } })
    if (existing) {
        return { error: "Alias already taken" }
    }

    let ownerId: string | undefined = undefined
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (user) ownerId = user.id
    }

    // Generate secret token for everyone, though mostly used for anon
    // ???
    const editToken = crypto.randomUUID()

    const pageData: Prisma.PageUncheckedCreateInput = {
        alias,
        isPublic: true,
        type: "list",
        ownerId: ownerId ?? null,
        // ???
        editToken
    }

    await prisma.page.create({
        data: pageData
    })

    if (ownerId) {
        revalidatePath("/dashboard")
        redirect(`/dashboard/${alias}`)
    } else {
        // Anonymous user: Set cookie to allow editing
        const cookieStore = await cookies()
        cookieStore.set('linkhub_edit_token', editToken, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        })

        // Redirect to dashboard with alias
        redirect(`/dashboard/${alias}`)
    }
}

export async function deletePage(pageId: string) {
    const session = await auth()
    const cookieStore = await cookies()
    const editToken = cookieStore.get('linkhub_edit_token')?.value

    const page = await prisma.page.findUnique({
        where: { id: pageId },
        include: { owner: true }
    })

    if (!page) throw new Error("Page not found")

    const isOwner = session?.user?.email && page.owner?.email === session.user.email
    const isAnonEditor = editToken && page.editToken === editToken

    if (!isOwner && !isAnonEditor) {
        throw new Error("Unauthorized")
    }

    await prisma.page.delete({
        where: { id: pageId }
    })

    revalidatePath("/dashboard")
}
