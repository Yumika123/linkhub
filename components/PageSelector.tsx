"use client"

import { Page } from "@prisma/client"
import { useRouter, useSearchParams } from "next/navigation"

interface PageSelectorProps {
    pages: Page[]
    currentPageAlias: string
}

export function PageSelector({ pages, currentPageAlias }: PageSelectorProps) {
    const router = useRouter()

    return (
        <div className="flex items-center gap-2">
            <select
                value={currentPageAlias}
                onChange={(e) => router.push(`/dashboard/${e.target.value}`)}
                className="block rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            >
                {pages.map((page) => (
                    <option key={page.id} value={page.alias}>
                        {page.alias}
                    </option>
                ))}
            </select>
        </div>
    )
}
