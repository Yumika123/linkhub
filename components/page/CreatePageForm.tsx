"use client";

import { createPage } from "@/app/actions/pages";
import { updatePage } from "@/app/actions/updateExitingPage";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/Input/input";
import { Page } from "@prisma/client";
import { useNotificationStore } from "@/components/ui/Notification/useNotification";

export function CreatePageForm({
  className,
  isAuthenticated = false,
  page,
  onSuccess,
}: {
  className?: string;
  isAuthenticated?: boolean;
  page?: Pick<Page, "id" | "title" | "description" | "alias">;
  onSuccess?: () => void;
}) {
  const { success, error } = useNotificationStore();

  async function handleSubmit(_: any, formData: FormData) {
    {
      try {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const alias = formData.get("alias") as string;

        const result = await createPage({
          title,
          description,
          alias: alias || undefined,
          links: [],
        });

        if (result?.error) {
          error(result.error, "Error");
          return;
        }

        if (result?.success && result?.alias) {
          success("Page created successfully", "Success");
          // Redirect happens via window.location for simplicity in this transition
          window.location.href = `/dashboard/${result.alias}`;
          return;
        }

        if (onSuccess) onSuccess();
      } catch (e: any) {
        // If it's a redirect, we don't want to catch it as an error
        if (e.message === "NEXT_REDIRECT") {
          throw e;
        }
        error(e.message, "Error");
      }
    }
  }

  const [_, formAction, isPending] = useActionState(handleSubmit, null);

  return (
    <form action={formAction} className={`space-y-4 ${className}`}>
      {isAuthenticated && (
        <>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Page Title
            </label>
            <Input
              type="text"
              name="title"
              placeholder="My Amazing Page"
              defaultValue={page?.title ?? "New Page"}
              required
              variant="glass"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              placeholder="A brief description of your page..."
              defaultValue={page?.description ?? ""}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder:text-white/20 transition-all min-h-[100px] resize-none"
            />
          </div>
        </>
      )}

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
