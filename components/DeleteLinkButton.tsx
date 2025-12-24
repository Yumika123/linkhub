"use client"

import { deleteLink } from "@/app/actions/links"
import { useTransition } from "react"

export function DeleteLinkButton({ linkId }: { linkId: string }) {
    const [isPending, startTransition] = useTransition()

    return (
        <button
            onClick={() => startTransition(() => deleteLink(linkId))}
            disabled={isPending}
            className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 bg-red-50 rounded hover:bg-red-100 transition-colors"
        >
            {isPending ? "Deleting..." : "Delete"}
        </button>
    )
}
