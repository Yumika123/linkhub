"use client";

import { updatePage } from "@/app/actions/updateExitingPage";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/Input/input";
import { Page } from "@prisma/client";
import { useNotificationStore } from "@/components/ui/Notification/useNotification";

export function EditPageForm({
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
    if (page) {
      try {
        await updatePage(page.id, {
          title: formData.get("title") as string,
          description: formData.get("description") as string,
        });
        if (onSuccess) onSuccess();
        success("Page updated successfully", "Success");
      } catch (e: any) {
        if (e.message === "NEXT_REDIRECT") {
          throw e;
        }

        error(e.message, "Error");
      }
    }
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, null);

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

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isPending}
          variant="gradient"
          className="flex-1 gap-2"
        >
          {isPending ? "Updating..." : "Update Page"}
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
