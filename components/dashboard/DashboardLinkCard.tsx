"use client";

import { useState } from "react";
import { Link as LinkModel } from "@prisma/client";
import { getLinkIcon } from "@/lib/link-icons";
import { editLink } from "@/app/actions/editLink";
import { Input } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button/button";
import { DeleteLinkButton } from "../DeleteLinkButton";

interface DashboardLinkCardProps {
  link: LinkModel;
  view: "list" | "grid";
}

export function DashboardLinkCard({ link, view }: DashboardLinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const icon = getLinkIcon(link.url);

  if (isEditing) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
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
      </div>
    );
  }

  if (view === "grid") {
    return (
      <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
        <div className="flex flex-col h-full">
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-3xl mb-4">
            {icon}
          </div>

          <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">
            {link.title}
          </h3>

          <p className="text-white/50 text-sm mb-4 line-clamp-1 flex-grow">
            {link.url.replace(/^https?:\/\//, "")}
          </p>

          <a
            href={link.url}
            target={link.target}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors mt-auto"
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

        {/* Edit/Delete buttons on hover */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
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

  // List view
  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-start gap-4">
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
            target={link.target}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors"
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
          <DeleteLinkButton linkId={link.id} />
        </div>
      </div>
    </div>
  );
}
