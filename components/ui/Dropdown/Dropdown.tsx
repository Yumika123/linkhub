"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  menuClassName?: string;
  side?: "top" | "bottom";
}

export function Dropdown({
  trigger,
  children,
  className,
  menuClassName,
  side = "top",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const handleClose = () => {
    // Add a small delay to allow actions (like form submission or navigation) to trigger
    // before unmounting the component
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full text-left focus:outline-none rounded-xl transition-all duration-200 p-2 border border-transparent hover:cursor-pointer relative",
          isOpen ? "bg-white/10 border-white/10" : "hover:bg-white/5"
        )}
      >
        {trigger}

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
              isOpen && "rotate-180"
            )}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute left-0 w-full mb-2 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200",
            side === "top"
              ? "bottom-full slide-in-from-bottom-2"
              : "top-full mt-2 slide-in-from-top-2",
            menuClassName
          )}
          onClick={handleClose}
        >
          {children}
        </div>
      )}
    </div>
  );
}
