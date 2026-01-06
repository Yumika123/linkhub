"use client";

import { deleteLink } from "@/app/actions/links";
import { useTransition } from "react";
import { Button } from "@/components/ui";

export function DeleteLinkButton({
  linkId,
  onDelete,
}: {
  linkId: string;
  onDelete?: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() =>
        startTransition(() => {
          if (onDelete) {
            onDelete(linkId);
          } else {
            deleteLink(linkId);
          }
        })
      }
      disabled={isPending}
      variant="danger"
      buttonSize="sm"
      rounded="lg"
    >
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
