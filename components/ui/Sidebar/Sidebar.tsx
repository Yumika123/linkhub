"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  position?: "left" | "right";
  mode?: "slide" | "static";
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  width?: string;
  showBackdrop?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  lockBodyScroll?: boolean;
}

export function Sidebar({
  isOpen,
  onClose,
  position = "left",
  mode = "slide",
  header,
  children,
  footer,
  className,
  width = "w-64",
  showBackdrop = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  lockBodyScroll = true,
}: SidebarProps) {
  React.useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  const sidebarRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!closeOnBackdropClick || !isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (sidebarRef.current && sidebarRef.current.contains(e.target as Node)) {
        return;
      }
      onClose?.();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose, closeOnBackdropClick]);

  React.useEffect(() => {
    if (!lockBodyScroll) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, lockBodyScroll]);

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onClose?.();
    }
  };

  const getTransformClasses = () => {
    if (mode === "static") {
      return "translate-x-0"; // Always visible
    }

    // Slide mode
    if (position === "left") {
      return isOpen ? "translate-x-0" : "-translate-x-full";
    } else {
      return isOpen ? "translate-x-0" : "translate-x-full";
    }
  };
  const positionClasses = position === "left" ? "left-0" : "right-0";
  const borderClasses = position === "left" ? "border-r" : "border-l";

  return (
    <>
      {showBackdrop && isOpen && mode === "slide" && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={handleBackdropClick}
        />
      )}

      <aside
        ref={sidebarRef}
        className={cn(
          "fixed top-0 h-full bg-linear-to-b from-blue-900/40 to-purple-900/40 backdrop-blur-xl border-white/10 z-50",
          "transform transition-transform duration-300 ease-in-out",
          positionClasses,
          borderClasses,
          width,
          getTransformClasses(),
          mode === "static" && "lg:translate-x-0",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {header && <div className="shrink-0">{header}</div>}

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </div>

          {footer && <div className="shrink-0">{footer}</div>}
        </div>
      </aside>
    </>
  );
}
