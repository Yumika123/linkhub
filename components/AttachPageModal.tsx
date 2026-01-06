"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal/Modal";
import { Button } from "@/components/ui/Button/button";
import { attachAnonymousPage } from "@/app/actions/attach";
import { useNotificationStore } from "@/components/ui/Notification/useNotification";

interface AttachPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: { id: string; title: string; alias: string };
}

export function AttachPageModal({
  isOpen,
  onClose,
  page,
}: AttachPageModalProps) {
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotificationStore();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await attachAnonymousPage(page.id);
      success("Page attached to your account successfully", "Success");
      onClose();
      // Reload to reflect ownership changes (client needs to re-fetch/hydrate)
      window.location.reload();
    } catch (err: any) {
      error(err.message, "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Claim This Page"
      description={`This appears to be an anonymous page "${page.title}" (${page.alias}). Would you like to claim it and attach it to your account?`}
      showCloseButton={true}
      preventClose={loading}
    >
      <div className="flex gap-3 mt-6">
        <Button
          variant="gradient"
          className="flex-1"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Claiming..." : "Yes, Claim Page"}
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={onClose}
          disabled={loading}
        >
          No, Cancel
        </Button>
      </div>
    </Modal>
  );
}
