import { cn } from "@/lib/utils";
import Link from "next/link";

interface SidebarItemProps {
  icon?: string | React.ReactNode;
  label: string;
  sublabel?: string;
  badge?: string | number;
  isActive?: boolean;
  isDragging?: boolean;
  href: string;
  className?: string;
}

export function SidebarItem({
  icon = "📄",
  label,
  sublabel,
  badge,
  isActive,
  href,
  className,
  isDragging,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "block px-4 py-3 rounded-xl transition-all",
        isActive
          ? "bg-white/10 border border-white/20 shadow-lg"
          : "bg-white/5 border border-white/5 hover:bg-white/10",
        className
      )}
      onClickCapture={(e: React.MouseEvent) => {
        if (isDragging) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-lg">{icon}</span>
        </div>
        <div className="grow min-w-0">
          <div className="font-medium text-white text-sm truncate">{label}</div>
          {sublabel && (
            <div className="text-xs text-white/40 truncate">{sublabel}</div>
          )}
        </div>
        {badge !== undefined && (
          <div className="shrink-0 text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
            {badge}
          </div>
        )}
      </div>
    </Link>
  );
}
