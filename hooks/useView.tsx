"use client";

import { useState, useCallback } from "react";
import { ViewToggle as ViewToggleComponent } from "@/components/dashboard/ViewToggle";

interface UseViewOptions {
  defaultView?: "list" | "grid";
}

// TODO: Think to join with LinkGrid component
export function useView({ defaultView = "list" }: UseViewOptions = {}) {
  const [view, setView] = useState<"list" | "grid">(defaultView);

  const ViewToggle = useCallback(() => {
    return <ViewToggleComponent view={view} onViewChange={setView} />;
  }, [view]);

  return {
    view,
    setView,
    ViewToggle,
  };
}
