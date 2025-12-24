"use client"

import { updatePage } from "@/app/actions/updateExitingPage"
import { deletePage } from "@/app/actions/pages"
import { Page } from "@prisma/client"
import { useTransition } from "react"

interface PageSettingsProps {
    page: Page
}

export function PageSettings({ page }: PageSettingsProps) {
    const [isPending, startTransition] = useTransition()

    const toggleLayout = () => {
        const newType = page.type === "list" ? "image" : "list"
        startTransition(() => updatePage(page.id, { type: newType }))
    }

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
            startTransition(() => deletePage(page.id))
        }
    }

    return (
        <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Layout: <strong>{page.type === "list" ? "List" : "Grid"}</strong></span>
            <button
                onClick={toggleLayout}
                disabled={isPending}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
                Switch to {page.type === "list" ? "Grid" : "List"}
            </button>
            <div className="h-4 w-px bg-gray-300 mx-2"></div>
            <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-3 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50 disabled:opacity-50"
            >
                Delete Page
            </button>
        </div>
    )
}
