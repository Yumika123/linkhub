"use client";

import { useState } from "react";
import { Link as LinkModel } from "@prisma/client";
import { getLinkIcon } from "@/lib/link-icons";
import { editLink } from "@/app/actions/links";
import { Input } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button/button";
import { DeleteLinkButton } from "../DeleteLinkButton";

interface DashboardLinkCardProps {
  link: LinkModel;
  onEdit?: (id: string, formData: FormData) => void;
  onDelete?: (id: string) => void;
  view: "list" | "grid";
}

export function DashboardLinkCard({
  link,
  onEdit,
  onDelete,
  view,
}: DashboardLinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const icon = getLinkIcon(link.url);

  if (isEditing) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <form
          action={async (formData) => {
            if (onEdit) {
              onEdit(link.id, formData);
            } else {
              await editLink(link.id, formData);
            }

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
      </div>
    );
  }

  if (view === "grid") {
    return (
      <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-grab active:cursor-grabbing">
        <div className="absolute top-4 left-4 text-white/30 group-hover:text-white/50 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="5" r="1.5" />
            <circle cx="15" cy="5" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="19" r="1.5" />
            <circle cx="15" cy="19" r="1.5" />
          </svg>
        </div>

        <div className="flex flex-col h-full">
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-3xl mb-4">
            {icon}
          </div>

          <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">
            {link.title}
          </h3>

          <p className="text-white/50 text-sm mb-4 line-clamp-1 grow">
            {link.url.replace(/^https?:\/\//, "")}
          </p>

          <a
            href={link.url}
            target={link.target}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors mt-auto"
            onClick={(e) => e.stopPropagation()}
          >
            Visit Link
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
          </a>
        </div>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <Button
            onClick={() => setIsEditing(true)}
            variant="brand"
            buttonSize="sm"
            rounded="lg"
          >
            Edit
          </Button>
          <DeleteLinkButton linkId={link.id} onDelete={onDelete} />
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-grab active:cursor-grabbing">
      <div className="flex items-start gap-4">
        <div className="text-white/30 group-hover:text-white/50 transition-colors shrink-0 pt-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="5" r="1.5" />
            <circle cx="15" cy="5" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="19" r="1.5" />
            <circle cx="15" cy="19" r="1.5" />
          </svg>
        </div>

        <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-3xl shrink-0">
          {icon}
        </div>

        <div className="grow min-w-0">
          <h3 className="font-semibold text-white text-lg mb-1">
            {link.title}
          </h3>
          <p className="text-white/50 text-sm mb-3 truncate">
            {link.url.replace(/^https?:\/\//, "")}
          </p>
          <a
            href={link.url}
            target={link?.target ?? "_blank"}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Visit Link
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
          </a>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <Button
            onClick={() => setIsEditing(true)}
            variant="brand"
            buttonSize="sm"
            rounded="lg"
          >
            Edit
          </Button>
          <DeleteLinkButton linkId={link.id} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}
