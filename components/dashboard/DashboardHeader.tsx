"use client";

import { ViewToggle } from "./ViewToggle";
import { Page } from "@prisma/client";

interface DashboardHeaderProps {
  page: Page;
  view: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
  onAddLink?: () => void;
  onEditPage?: () => void;
}

import { Button } from "../ui";

export function DashboardHeader({
  page,
  view,
  onViewChange,
  onAddLink,
  onEditPage,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200 mb-2">
            {page.title}
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            {page.description ||
              "Manage and organize your links for this page. Share this collection with the world."}
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-white/40">{`${location.origin}/${page.alias}`}</span>
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
        {onEditPage && (
          <Button
            onClick={onEditPage}
            variant="glass"
            buttonSize="icon"
            className="gap-2 px-6"
            rounded="full"
          >
            Edit Page
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
