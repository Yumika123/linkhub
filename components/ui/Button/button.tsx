import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none hover:cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-white text-purple-600 hover:bg-blue-50 shadow-lg hover:shadow-xl",
        secondary:
          "bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20",
        ghost: "text-white/60 hover:text-white hover:bg-white/10",
        outline: "border-white/20 text-white hover:bg-white/5",
        glass:
          "bg-white/10 hover:bg-white/15 text-white rounded-xl transition-all border-white/10",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg",
        gradient:
          "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white",
        brand: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
        black: "bg-black text-white hover:bg-gray-800 shadow-lg",
      },
      buttonSize: {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-body font-medium",
        lg: "px-8 py-4 text-h3 font-medium",
        icon: "p-3",
        fab: "p-4",
      },
      rounded: {
        none: "rounded-none",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
      withScale: {
        true: "hover:scale-105 active:scale-95",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      buttonSize: "md",
      rounded: "full",
      withScale: true,
    },
  }
);

type ButtonAsButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: "button";
};

type ButtonAsAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  as: "a";
};

type ButtonAsLinkProps = React.ComponentProps<typeof Link> & {
  as: "link";
};

export type ButtonProps = VariantProps<typeof buttonVariants> &
  (ButtonAsButtonProps | ButtonAsAnchorProps | ButtonAsLinkProps);

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    { className, variant, buttonSize: size, rounded, withScale, ...props },
    ref
  ) => {
    const classes = cn(
      buttonVariants({
        variant,
        buttonSize: size,
        rounded,
        withScale,
        className,
      })
    );

    if ("as" in props) {
      const { as, ...rest } = props;
      if (as === "link") {
        return (
          <Link
            className={classes}
            {...(rest as React.ComponentProps<typeof Link>)}
          />
        );
      }
      if (as === "a") {
        return (
          <a
            className={classes}
            {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          />
        );
      }
    }

    const { as: _, ...buttonProps } = props as ButtonAsButtonProps;
    return (
      <button
        className={classes}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...buttonProps}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
