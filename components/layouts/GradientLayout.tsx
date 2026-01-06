import React from "react";

import { cn } from "@/lib/utils";

interface GradientLayoutProps {
  children: React.ReactNode;
  maxWidth?: "2xl" | "4xl" | "6xl";
  centered?: boolean;
  className?: string;
}

/**
 * Reusable layout component with gradient background
 * Used across landing page, dashboard, and public pages
 */
export function GradientLayout({
  children,
  maxWidth = "2xl",
  centered = false,
  className,
}: GradientLayoutProps) {
  const maxWidthClasses = {
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
  };

  return (
    <div className="min-h-screen w-full relative font-sans text-white selection:bg-purple-500 selection:text-white">
      <div
        className={cn(
          "relative z-10 container mx-auto px-4 py-16 md:py-24",
          maxWidthClasses[maxWidth],
          centered && "flex items-center justify-center min-h-screen",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
