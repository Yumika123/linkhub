"use client";

import { Button } from "./ui";

interface DeletePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeletePageModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeletePageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in"
      onClick={isDeleting ? undefined : onClose}
    >
      <div
        className="bg-linear-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-2 text-white">Delete Page?</h2>
        <p className="text-white/60 text-sm mb-6">
          Are you sure you want to delete this page? This action cannot be
          undone.
        </p>

        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="ghost"
            disabled={isDeleting}
            className="text-white/60 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white border-0"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
