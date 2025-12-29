"use client";

interface ViewToggleProps {
  view: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
}

import { Button } from "../ui";

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-1">
      <Button
        onClick={() => onViewChange("list")}
        variant={view === "list" ? "secondary" : "ghost"}
        buttonSize="icon"
        rounded="md"
        className={
          view === "list" ? "bg-white/10" : "opacity-40 hover:opacity-100"
        }
        aria-label="List view"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </Button>
      <Button
        onClick={() => onViewChange("grid")}
        variant={view === "grid" ? "secondary" : "ghost"}
        buttonSize="icon"
        rounded="md"
        className={
          view === "grid" ? "bg-white/10" : "opacity-40 hover:opacity-100"
        }
        aria-label="Grid view"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </Button>
    </div>
  );
}
