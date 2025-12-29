"use client";

import { updatePage } from "@/app/actions/updateExitingPage";
import { deletePage } from "@/app/actions/pages";
import { Page } from "@prisma/client";
import { useTransition } from "react";

interface PageSettingsProps {
  page: Page;
}

import { Button } from "@/components/ui";

export function PageSettings({ page }: PageSettingsProps) {
  const [isPending, startTransition] = useTransition();

  const toggleLayout = () => {
    const newType = page.type === "list" ? "image" : "list";
    startTransition(() => updatePage(page.id, { type: newType }));
  };

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this page? This action cannot be undone."
      )
    ) {
      startTransition(() => deletePage(page.id));
    }
  };

  return (
    <div className="flex items-center gap-4 text-sm text-white/60">
      <span>
        Layout:{" "}
        <strong className="text-white">
          {page.type === "list" ? "List" : "Grid"}
        </strong>
      </span>
      <Button
        onClick={toggleLayout}
        disabled={isPending}
        variant="outline"
        buttonSize="sm"
        rounded="lg"
      >
        Switch to {page.type === "list" ? "Grid" : "List"}
      </Button>
      <div className="h-4 w-px bg-white/10 mx-2"></div>
      <Button
        onClick={handleDelete}
        disabled={isPending}
        variant="danger"
        buttonSize="sm"
        rounded="lg"
      >
        Delete Page
      </Button>
    </div>
  );
}
