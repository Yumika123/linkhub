"use client";

import { ViewToggle } from "./ViewToggle";

interface DashboardHeaderProps {
  pageTitle: string;
  pageAlias: string;
  pageUrl: string;
  view: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
  onAddLink?: () => void;
}

import { Button } from "../ui";

export function DashboardHeader({
  pageTitle,
  pageAlias,
  pageUrl,
  view,
  onViewChange,
  onAddLink,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200 mb-2">
            {pageTitle}
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Manage and organize your links for this page. Share this collection
            with the world.
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-white/40">{pageUrl}</span>
          </div>
        </div>
        {onAddLink && (
          <Button
            onClick={onAddLink}
            variant="glass"
            buttonSize="icon"
            className="gap-2 px-6"
            rounded="full"
          >
            Add Link
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <ViewToggle view={view} onViewChange={onViewChange} />
        <div className="text-sm text-white/40">
          {/* Additional controls can go here */}
        </div>
      </div>
    </div>
  );
}
