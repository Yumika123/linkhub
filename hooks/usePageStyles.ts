"use client";

import { useEffect, useState } from "react";
import {
  updateCustomPageStyles,
  deleteCustomPageStyles,
} from "@/app/actions/customPageStyles";
import { PageStyles } from "@/types/PageStyles";
import { useNotificationStore } from "@/components/ui/Notification/useNotification";

interface UsePageStylesParams {
  pageId: string;
  initialStyles: PageStyles;
}

interface UsePageStylesReturn {
  showStyleSidebar: boolean;
  isSaving: boolean;
  background: string | null;

  openStyleSidebar: () => void;
  closeStyleSidebar: () => void;
  handleBackgroundChange: (value: string | null) => void;
  handleSave: () => Promise<void>;
  handleReset: () => Promise<void>;
}

import { useUIStore } from "@/store/UIStore";

export function usePageStyles({
  pageId,
  initialStyles,
}: UsePageStylesParams): UsePageStylesReturn {
  const { isStyleSidebarOpen, openStyleSidebar, closeStyleSidebar } =
    useUIStore();
  const [isSaving, setIsSaving] = useState(false);

  const [background, setBackground] = useState(
    initialStyles?.background.color || null
  );

  useEffect(() => {
    setBackground(initialStyles?.background.color || null);
  }, [initialStyles]);

  const { success, error } = useNotificationStore();

  const handleBackgroundChange = (value: string | null) => setBackground(value);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const result = await updateCustomPageStyles(
        {
          background: {
            color: background,
            image: "",
          },
        },
        pageId
      );

      if (result.success) {
        success("Styles saved successfully", "Success");
        closeStyleSidebar();
      } else {
        error(result.error || "Failed to save styles", "Error");
      }
    } catch (err: any) {
      console.error("Error saving style:", err);
      error(err.message || "Failed to save styles", "Error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsSaving(true);
      const result = await deleteCustomPageStyles(pageId);

      if (result.success) {
        success("Styles reset successfully", "Success");
        setBackground(null);
        closeStyleSidebar();
      } else {
        error(result.error || "Failed to reset styles", "Error");
      }
    } catch (err: any) {
      console.error("Error resetting style:", err);
      error(err.message || "Failed to reset styles", "Error");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    showStyleSidebar: isStyleSidebarOpen,
    isSaving,
    background,
    openStyleSidebar,
    closeStyleSidebar,
    handleBackgroundChange,
    handleSave,
    handleReset,
  };
}
