"use client";

import { createPage } from "@/app/actions/pages";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/Input/input";

export function CreatePageForm({
  className,
  variant = "primary",
  isAuthenticated = false,
}: {
  className?: string;
  variant?: "primary" | "secondary" | "action";
  isAuthenticated?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(createPage, null);

  return (
    <form action={formAction} className={`space-y-4 ${className}`}>
      {isAuthenticated && (
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Page Alias (Optional)
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg bg-white/5 border border-r-0 border-white/20 text-white/60 text-sm">
              linkhub.com/
            </span>
            <Input
              type="text"
              name="alias"
              placeholder="my-page (3-50 chars)"
              pattern="[a-zA-Z0-9_-]{3,50}"
              title="Only Latin letters, digits, hyphens, and underscores (3-50 characters)"
              className="flex-1 rounded-l-none"
              variant="glass"
              minLength={3}
              maxLength={50}
            />
          </div>
          <p className="text-xs text-white/40 mt-2">
            Latin letters, digits, hyphens, and underscores only. Leave empty
            for random ID.
          </p>
          {state?.error && (
            <p className="text-sm text-red-400 mt-2">{state.error}</p>
          )}
        </div>
      )}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isPending}
          variant="gradient"
          className="flex-1 gap-2"
        >
          {isPending
            ? "Creating..."
            : isAuthenticated
            ? "Create Page"
            : "Create Anonymous Page"}
          {!isPending && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </Button>
      </div>
    </form>
  );
}
