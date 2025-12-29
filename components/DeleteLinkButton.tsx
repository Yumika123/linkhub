"use client";

import { deleteLink } from "@/app/actions/links";
import { useTransition } from "react";
import { Button } from "@/components/ui";

export function DeleteLinkButton({ linkId }: { linkId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() => startTransition(() => deleteLink(linkId))}
      disabled={isPending}
      variant="danger"
      buttonSize="sm"
      rounded="lg"
    >
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
