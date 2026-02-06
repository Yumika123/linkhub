"use client";

import { useState, useCallback, useEffect } from "react";
import { ViewToggle as ViewToggleComponent } from "@/components/dashboard/ViewToggle";

interface UseViewOptions {
  defaultView?: "list" | "grid";
  pageId?: string;
  onViewChange?: (pageId: string, view: "list" | "grid") => void;
}

export function useView({
  defaultView = "list",
  pageId,
  onViewChange,
}: UseViewOptions = {}) {
  const [view, setView] = useState<"list" | "grid">(defaultView);

  useEffect(() => {
    setView(defaultView);
  }, [defaultView]);

  const handleViewChange = useCallback(
    (newView: "list" | "grid") => {
      setView(newView);
      if (pageId && onViewChange) {
        onViewChange(pageId, newView);
      }
    },
    [pageId, onViewChange],
  );

  const ViewToggle = useCallback(() => {
    return <ViewToggleComponent view={view} onViewChange={handleViewChange} />;
  }, [view, handleViewChange]);

  return {
    view,
    setView,
    ViewToggle,
  };
}
