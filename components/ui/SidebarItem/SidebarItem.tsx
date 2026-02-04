"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";
import { togglePagePublic } from "@/app/actions/pages";

import { Switch } from "../Switch/Switch";

interface SidebarItemProps {
  label: string;
  sublabel?: string;
  badge?: string | number;
  isActive?: boolean;
  isDragging?: boolean;
  href: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  pageId?: string;
  isPublic?: boolean;
}

export function SidebarItem({
  label,
  sublabel,
  badge,
  isActive,
  href,
  className,
  isDragging,
  onClick,
  actions,
  pageId,
  isPublic = false,
}: SidebarItemProps & { actions?: React.ReactNode }) {
  const [publicState, setPublicState] = useState(isPublic);

  useEffect(() => {
    setPublicState(isPublic);
  }, [isPublic]);

  const handleToggle = async (checked: boolean) => {
    setPublicState(checked);

    if (!pageId) return;

    try {
      await togglePagePublic(pageId, checked);
    } catch (error) {
      console.error("Failed to toggle page public status:", error);
      setPublicState(!checked);
    }
  };

  return (
    <div className={cn("relative group", className)}>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative",
          isActive
            ? "bg-white/10 border border-white/20 shadow-lg"
            : "bg-white/5 border border-white/5 hover:bg-white/10",
        )}
      >
        <div
          className="flex items-center justify-center shrink-0 relative z-20"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Switch
            variant="circle"
            checked={publicState}
            onCheckedChange={handleToggle}
            onClick={(e) => e.stopPropagation()}
            size="sm"
          />
        </div>

        <Link
          href={href}
          className="grow min-w-0 flex flex-col z-10"
          onClick={onClick}
        >
          <div className="font-medium text-white text-sm truncate">{label}</div>
          {sublabel && (
            <div className="text-xs text-white/40 truncate">{sublabel}</div>
          )}
        </Link>

        {badge !== undefined && (
          <div className="shrink-0 text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
            {badge}
          </div>
        )}

        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
