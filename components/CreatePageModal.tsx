"use client"

import { useState } from "react"
import { CreatePageForm } from "./CreatePageForm"

export function CreatePageModal() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-xs bg-black text-white hover:bg-gray-800 px-3 py-1.5 rounded transition-colors"
            >
                + New Page
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in zoom-in-95">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-4">Create New Page</h2>
                        <CreatePageForm isAuthenticated={true} />
                    </div>
                </div>
            )}
        </>
    )
}
