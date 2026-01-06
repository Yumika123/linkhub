"use client";

import { Modal } from "./ui/Modal/Modal";
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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Page?"
      description="Are you sure you want to delete this page? This action cannot be undone."
      className="max-w-sm"
      preventClose={isDeleting}
      showCloseButton={!isDeleting}
    >
      <div className="flex justify-end gap-3 pt-4">
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
    </Modal>
  );
}
