"use client"

import { useState } from "react"
import { Link as LinkModel } from "@prisma/client"
import { LinkItem } from "./LinkItem"
import { DeleteLinkButton } from "./DeleteLinkButton"
import { editLink } from "@/app/actions/editLink"

interface EditableLinkProps {
    link: LinkModel
}

export function EditableLink({ link }: EditableLinkProps) {
    const [isEditing, setIsEditing] = useState(false)

    if (isEditing) {
        return (
            <div className="bg-gray-50 border border-black p-4 rounded-lg">
                <form action={async (formData) => {
                    await editLink(link.id, formData)
                    setIsEditing(false)
                }} className="flex flex-col gap-3">
                    <input
                        type="text"
                        name="title"
                        defaultValue={link.title}
                        className="border rounded px-2 py-1"
                        placeholder="Title"
                        required
                    />
                    <input
                        type="url"
                        name="url"
                        defaultValue={link.url}
                        className="border rounded px-2 py-1"
                        placeholder="URL"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
                        <button type="submit" className="px-3 py-1 text-sm bg-black text-white hover:bg-gray-800 rounded">Save</button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="group relative">
            <div className="pr-24">
                <LinkItem link={link} variant="list" />
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium px-3 py-1 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                >
                    Edit
                </button>
                <DeleteLinkButton linkId={link.id} />
            </div>
        </div>
    )
}
