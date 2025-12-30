"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function updatePage(pageId: string, data: { type?: string, isPublic?: boolean, title?: string, description?: string }) {
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

    await prisma.page.update({
        where: { id: pageId },
        data
    })

    revalidatePath("/dashboard")
    revalidatePath(`/${page.alias}`)
}
