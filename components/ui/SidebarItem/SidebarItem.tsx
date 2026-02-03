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
  onClick?: (e: React.MouseEvent) => void;
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
  onClick,
  actions,
}: SidebarItemProps & { actions?: React.ReactNode }) {
  return (
    <div className={cn("relative group", className)}>
      <Link
        href={href}
        className={cn(
          "block px-4 py-3 rounded-xl transition-all",
          isActive
            ? "bg-white/10 border border-white/20 shadow-lg"
            : "bg-white/5 border border-white/5 hover:bg-white/10"
        )}
        onClickCapture={(e: React.MouseEvent) => {
          if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          onClick?.(e);
        }}
      >
        <div className="flex items-center gap-3 pr-8">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg">{icon}</span>
          </div>
          <div className="grow min-w-0">
            <div className="font-medium text-white text-sm truncate">
              {label}
            </div>
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
      {actions && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {actions}
        </div>
      )}
    </div>
  );
}
