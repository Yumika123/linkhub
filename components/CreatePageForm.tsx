"use client"

import { createPage } from "@/app/actions/pages"
import { useActionState } from "react"

export function CreatePageForm({
    className,
    isAuthenticated = false
}: {
    className?: string
    isAuthenticated?: boolean
}) {
    const [state, formAction, isPending] = useActionState(createPage, null)

    return (
        <form action={formAction} className={`space-y-4 ${className}`}>
            {isAuthenticated && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Page Alias (Optional)</label>
                    <div className="flex mt-1">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                            linkhub.com/
                        </span>
                        <input
                            type="text"
                            name="alias"
                            placeholder="my-page (3-50 chars)"
                            pattern="[a-zA-Z0-9_-]{3,50}"
                            title="Only Latin letters, digits, hyphens, and underscores (3-50 characters)"
                            className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-black focus:ring-black px-3 py-2 border"
                            minLength={3}
                            maxLength={50}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Latin letters, digits, hyphens, and underscores only. Leave empty for random ID.</p>
                    {state?.error && (
                        <p className="text-sm text-red-600 mt-2">{state.error}</p>
                    )}
                </div>
            )}
            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
                {isPending ? "Creating..." : isAuthenticated ? "Create Page" : "Create Anonymous Page"}
            </button>
        </form>
    )
}
