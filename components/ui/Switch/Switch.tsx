"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const switchVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-8 w-14",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const thumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-full data-[state=unchecked]:translate-x-0 bg-gradient-to-br from-white to-gray-200",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-7 w-7",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface SwitchProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof switchVariants> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, size, checked, onCheckedChange, onClick, ...props }, ref) => {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        className={cn(
          switchVariants({ size, className }),
          checked ? "bg-green-500" : "bg-red-500",
          "shadow-inner",
        )}
        onClick={(e) => {
          if (onCheckedChange) {
            onCheckedChange(!checked);
          }
          onClick?.(e);
        }}
        ref={ref}
        {...props}
      >
        <span
          data-state={checked ? "checked" : "unchecked"}
          className={cn(thumbVariants({ size }))}
        />
      </button>
    );
  },
);
Switch.displayName = "Switch";

export { Switch };
