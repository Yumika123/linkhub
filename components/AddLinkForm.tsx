"use client";

import { useState } from "react";
import { createLink } from "@/app/actions/links";
import { Button } from "./ui";

interface AddLinkFormProps {
  pageId?: string;
  onAdd?: (link: { title: string; url: string }) => void;
  onClose?: () => void;
}

export function AddLinkForm({ pageId, onAdd, onClose }: AddLinkFormProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          Add New Link
        </h2>
        <form
          action={async (formData) => {
            const title = formData.get("title") as string;
            const url = formData.get("url") as string;

            if (onAdd) {
              onAdd({ title, url });
              handleClose();
            } else if (pageId) {
              await createLink(formData);
              handleClose();
            }
          }}
          className="space-y-5"
        >
          {pageId && <input type="hidden" name="pageId" value={pageId} />}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="My Awesome Link"
              className="w-full rounded-xl border-gray-200 shadow-sm focus:border-black focus:ring-black px-4 py-3 border transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              URL
            </label>
            <input
              type="url"
              name="url"
              placeholder="https://example.com"
              className="w-full rounded-xl border-gray-200 shadow-sm focus:border-black focus:ring-black px-4 py-3 border transition-all"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button
              type="button"
              onClick={handleClose}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </Button>
            <Button type="submit" variant="black" className="flex-1">
              Create Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
