"use client"

import { useState } from "react"
import { createLink } from "@/app/actions/links"

interface AddLinkFormProps {
    pageId: string
}

export function AddLinkForm({ pageId }: AddLinkFormProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-50 flex items-center justify-center"
                aria-label="Add Link"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h2 className="text-xl font-bold mb-4">Add New Link</h2>
                <form action={async (formData) => {
                    await createLink(formData)
                    setIsOpen(false)
                }} className="space-y-4">
                    <input type="hidden" name="pageId" value={pageId} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" placeholder="My Awesome Link" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black px-3 py-2 border" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL</label>
                        <input type="url" name="url" placeholder="https://example.com" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black px-3 py-2 border" required />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                        >
                            Create Link
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
