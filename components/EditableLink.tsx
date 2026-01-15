"use client";

import { useState } from "react";
import { Link as LinkModel } from "@prisma/client";
import { LinkItem } from "./LinkItem";
import { DeleteLinkButton } from "./DeleteLinkButton";
import { editLink } from "@/app/actions/links";
import { Card } from "@/components/ui/Card/card";
import { Input } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button/button";

interface EditableLinkProps {
  link: LinkModel;
}

export function EditableLink({ link }: EditableLinkProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <Card variant="glassLight" padding="sm" rounded="xl">
        <form
          action={async (formData) => {
            await editLink(link.id, formData);
            setIsEditing(false);
          }}
          className="flex flex-col gap-3"
        >
          <Input
            type="text"
            name="title"
            defaultValue={link.title}
            variant="glass"
            placeholder="Title"
            required
          />
          <Input
            type="url"
            name="url"
            defaultValue={link.url}
            variant="glass"
            placeholder="URL"
            required
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => setIsEditing(false)}
              variant="ghost"
              buttonSize="sm"
              rounded="md"
            >
              Cancel
            </Button>
            <Button type="submit" variant="brand" buttonSize="sm" rounded="md">
              Save
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <div className="group relative">
      <div className="pr-24">
        <LinkItem link={link} variant="list" />
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <Button
          onClick={() => setIsEditing(true)}
          variant="brand"
          buttonSize="sm"
          rounded="lg"
        >
          Edit
        </Button>
        <DeleteLinkButton linkId={link.id} />
      </div>
    </div>
  );
}
