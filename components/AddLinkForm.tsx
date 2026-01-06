"use client";

import { useState } from "react";
import { createLink } from "@/app/actions/links";
import { Button } from "./ui";
import { Input } from "@/components/ui/Input/input";

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

  // TODO: Replace with Modal
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-linear-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          onClick={handleClose}
          variant="ghost"
          buttonSize="icon"
          className="absolute top-6 right-6"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </Button>

        <h2 className="text-2xl font-bold mb-6 text-white text-center">
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
            <label className="block text-sm font-medium text-white/80 mb-2">
              Title
            </label>
            <Input
              type="text"
              name="title"
              placeholder="My Awesome Link"
              required
              variant="glass"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              URL
            </label>
            <Input
              type="url"
              name="url"
              placeholder="https://example.com"
              required
              variant="glass"
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button
              type="button"
              onClick={handleClose}
              variant="ghost"
              className="text-white/60 hover:text-white"
            >
              Cancel
            </Button>
            <Button type="submit" variant="gradient" className="flex-1">
              Create Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
