"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  side?: "top" | "bottom";
  align?: "start" | "end";
  showChevron?: boolean;
  usePortal?: boolean;
}

export function Dropdown({
  trigger,
  children,
  className,
  triggerClassName,
  menuClassName,
  side = "top",
  align = "start",
  showChevron = true,
  usePortal = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPositioned, setIsPositioned] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const portalNode = document.getElementById("dropdown-portal-content");
        if (portalNode && portalNode.contains(event.target as Node)) {
          return;
        }
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (usePortal && isOpen && triggerRef.current) {
      // Get the SidebarItem container (grandparent) for width calculation
      const sidebarItem = triggerRef.current.closest(".relative.group");
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const sidebarItemRect = sidebarItem?.getBoundingClientRect();

      let top = 0;
      let left = 0;
      let width = sidebarItemRect?.width || 200;

      if (side === "bottom") {
        // Position below the sidebar item
        top = (sidebarItemRect?.bottom || triggerRect.bottom) + 4;
      } else {
        top = (sidebarItemRect?.top || triggerRect.top) - 10;
      }

      // Align to the left edge of the sidebar item
      left = sidebarItemRect?.left || triggerRect.left;

      setCoords({ top, left, width });
      // Small delay to ensure position is set before showing
      requestAnimationFrame(() => {
        setIsPositioned(true);
      });
    } else if (!isOpen) {
      setIsPositioned(false);
    }
  }, [isOpen, usePortal, side, align]);

  const handleClose = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const portalContent = isPositioned ? (
    <div
      id="dropdown-portal-content"
      className={cn(
        "fixed z-9999 bg-[#0f172a] backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1.5",
        "animate-in fade-in slide-in-from-top-2 duration-200",
        menuClassName,
      )}
      style={{
        top: coords.top,
        left: coords.left,
        width: coords.width,
        bottom: "auto",
        right: "auto",
        transformOrigin: "top center",
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div onClick={handleClose}>{children}</div>
    </div>
  ) : null;

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <button
        ref={triggerRef}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          "w-full text-left focus:outline-none transition-all duration-200 relative",
          !triggerClassName &&
            "rounded-xl p-2 border border-transparent hover:cursor-pointer",
          !triggerClassName &&
            (isOpen ? "bg-white/10 border-white/10" : "hover:bg-white/5"),
          triggerClassName,
        )}
      >
        {trigger}

        {showChevron && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={cn(
                "transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        )}
      </button>

      {isOpen &&
        (usePortal ? (
          createPortal(portalContent, document.body)
        ) : (
          <div
            className={cn(
              "absolute w-full mb-2 bg-[#0f172a] backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200",
              side === "top"
                ? "bottom-full slide-in-from-bottom-2"
                : "top-full mt-2 slide-in-from-top-2",
              menuClassName,
            )}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div onClick={handleClose}>{children}</div>
          </div>
        ))}
    </div>
  );
}
